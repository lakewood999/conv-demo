"""
Copyright 2022 Steven Su

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
"""
from flask import Flask, request, render_template, jsonify, send_from_directory
import io, json, os, requests
import cv2, base64
import numpy as np
from PIL import Image

app = Flask(__name__)
app.secret_key = 'jfjsfS)DF0sF(H)#HODFJSLKDFJSL'

#pipenv run gunicorn --bind 127.0.0.1:8000 main:app

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico')

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def mnist_predict():
    if "image" not in request.form:
        return jsonify({"result":"error","message":"Missing image data"})
    image_data = base64.b64decode(request.form["image"].split(",")[1])
    f = io.BytesIO()
    f.write(image_data)
    f.seek(0)
    img_object = Image.open(f).convert('L')
    image_array = np.array([np.array(img_object)]) # note we enclose the image in brackets [] to match the needed format
    image_array = image_array.reshape(1,28,28,1) # set proper shape
    image_array = image_array.astype('float32')
    image_array = (255.0 - image_array)/255.0 # invert colors and normalize

    # query tensorflow server
    headers = {"content-type": "application/json"}
    data = json.dumps({"signature_name": "serving_default", "instances": image_array.tolist()})
    json_response = requests.post('http://predictor:8501/v1/models/model:predict', data=data, headers=headers)
    predictions = json.loads(json_response.text)['predictions'][0]
    
    # mess with the predictions
    predicted = predictions.index(max(predictions))
    resp = {"answer": predicted, "probabilities": predictions}

    return jsonify(resp)

@app.route("/convolve_image", methods=["POST"])
def handle_convolution_post():
    if "filterSize" not in request.form or "matrix" not in request.form or "image" not in request.files:
        return jsonify({"result":"error","message":"Missing data in POST request"})
    try:
        filter_size = int(request.form["filterSize"])
        kernel = json.loads(request.form["matrix"])
        # make all floats
        if len(kernel) != filter_size:
            return jsonify({"result":"error","message":"bad matrix size"})
        for i in range(len(kernel)):
            if len(kernel[i]) != filter_size:
                return jsonify({"result":"error","message":"bad matrix size"})
            for j in range(len(kernel[i])):
                kernel[i][j] = float(kernel[i][j])

        f = io.BytesIO()
        uploaded_file = request.files["image"]
        uploaded_file.save(f)
        f.seek(0)

        img = cv2.imdecode(np.frombuffer(f.read(), np.uint8), 1)

        # Creating the kernel(2d convolution matrix)
        kernel = np.array(kernel)
        # Applying the filter2D() function
        img_new = cv2.filter2D(src=img, ddepth=-1, kernel=kernel)

        retval, buffer = cv2.imencode('.jpg', img_new)
        jpg_as_text = base64.b64encode(buffer)

        return jpg_as_text
    except Exception as e:
        return jsonify({"result":"error","message":"Encountered error: " + str(e)})
    
    

if __name__ == "__main__":
    app.run()
