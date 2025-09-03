
from dotenv import load_dotenv
load_dotenv() 
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS 
import pandas as pd
from utils.fertilizer import fertilizer_dict
import os
import numpy as np
from keras.preprocessing import image
from keras.models import load_model
import pickle
from datetime import datetime 

app = Flask(__name__)

# Initialize Flask app
allowed_origins = [
    os.environ.get('FRONTEND_URL', 'https://agropulsee.netlify.app'),
    'http://localhost:3000',  
    'http://127.0.0.1:3000'   
]

CORS(app, 
     origins=allowed_origins,
     supports_credentials=True,  
     allow_headers=['Content-Type', 'Authorization'], 
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']  
)


classifier = load_model('Trained_model.h5')
classifier._make_predict_function()

crop_recommendation_model_path = 'Crop_Recommendation.pkl'
crop_recommendation_model = pickle.load(open(crop_recommendation_model_path, 'rb'))

# Helper function for pest prediction
def pred_pest(pest):
    try:
        print(f"Processing image: {pest}")
        print(f"File exists: {os.path.exists(pest)}")
        test_image = image.load_img(pest, target_size=(64, 64))
        print("Image loaded successfully")
        test_image = image.img_to_array(test_image)
        test_image = np.expand_dims(test_image, axis=0)
        print(f"Image shape: {test_image.shape}")
        predictions = classifier.predict(test_image)
        print(f"Raw predictions: {predictions}")
        result = np.argmax(predictions, axis=1)
        print(f"Argmax result: {result}")
        return result
    except Exception as e:
        print(f"Error in pest prediction: {str(e)}")
        return None
    
    
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/')
def home():
    return jsonify({
        'message': 'AgroPulse Backend API is running! 🚀',
        'status': 'healthy',
        'endpoints': {
            'health': '/api/health',
            'crop_prediction': '/api/crop-predict',
            'fertilizer': '/api/fertilizer-predict',
            'pest': '/api/pest-predict'
        },
        'documentation': 'Use /api endpoints for all requests'
    })

# API Routes
@app.route('/api/fertilizer-predict', methods=['POST'])
def fertilizer_recommend():
    try:
        data = request.get_json()
        
        crop_name = str(data['cropname'])
        N_filled = int(data['nitrogen'])
        P_filled = int(data['phosphorous'])
        K_filled = int(data['potassium'])

        df = pd.read_csv('Data/Crop_NPK.csv')

        N_desired = df[df['Crop'] == crop_name]['N'].iloc[0]
        P_desired = df[df['Crop'] == crop_name]['P'].iloc[0]
        K_desired = df[df['Crop'] == crop_name]['K'].iloc[0]

        n = N_desired - N_filled
        p = P_desired - P_filled
        k = K_desired - K_filled

        key1 = "NHigh" if n < 0 else "Nlow" if n > 0 else "NNo"
        key2 = "PHigh" if p < 0 else "Plow" if p > 0 else "PNo"
        key3 = "KHigh" if k < 0 else "Klow" if k > 0 else "KNo"

        abs_n = abs(n)
        abs_p = abs(p)
        abs_k = abs(k)

        return jsonify({
            'success': True,
            'recommendations': {
                'nitrogen': fertilizer_dict[key1],
                'phosphorous': fertilizer_dict[key2],
                'potassium': fertilizer_dict[key3]
            },
            'differences': {
                'nitrogen': abs_n,
                'phosphorous': abs_p,
                'potassium': abs_k
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/crop-predict', methods=['POST'])
def crop_prediction():
    try:
        data = request.get_json()
        
        N = int(data['nitrogen'])
        P = int(data['phosphorous'])
        K = int(data['potassium'])
        ph = float(data['ph'])
        rainfall = float(data['rainfall'])
        temperature = float(data['temperature'])
        humidity = float(data['humidity'])
        
        data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
        my_prediction = crop_recommendation_model.predict(data)
        final_prediction = my_prediction[0]
        
        return jsonify({
            'success': True,
            'prediction': final_prediction,
            'imageUrl': f'/static/crop/{final_prediction}.jpg'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/pest-predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image uploaded'}), 400
            
        file = request.files['image']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No selected file'}), 400

        filename = file.filename
        file_path = os.path.join('static/user_uploaded', filename)
        file.save(file_path)

        pred = pred_pest(pest=file_path)
        if pred is None:
            return jsonify({'success': False, 'error': 'Invalid image file'}), 400

        pest_map = {
            0: 'aphids',
            1: 'armyworm',
            2: 'beetle',
            3: 'bollworm',
            4: 'earthworm',
            5: 'grasshopper',
            6: 'mites',
            7: 'mosquito',
            8: 'sawfly',
            9: 'stem borer'
        }
        
        pest_identified = pest_map.get(pred[0], 'unknown')
        
        return jsonify({
            'success': True,
            'pest': pest_identified,
            'imageUrl': f'/static/user_uploaded/{filename}',
            'detailsUrl': f'/static/pest_info/{pest_identified}.html'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Static file serving
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# Health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)