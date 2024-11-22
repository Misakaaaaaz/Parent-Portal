import base64
import json
import os

# Function to encode image to base64
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    return encoded_string

# Prepare JSON data
images_data = []
image_directory = "./icons"

# Iterate through image files in the directory
for filename in os.listdir(image_directory):
    if filename.endswith(('.png', '.jpg', '.jpeg', '.gif')):
        image_path = os.path.join(image_directory, filename)
        encoded_image = encode_image(image_path)
        images_data.append({
            "filename": filename,
            "icon_data": encoded_image
        })

# Save to JSON file
with open('converted_icons.json', 'w') as json_file:
    json.dump(images_data, json_file, indent=4)
