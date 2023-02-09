import json

from lexer import *
from parser import *
from flask import *
from flask_cors import CORS
import shutil
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

@app.route('/tree', methods=['GET'])
def main():
    filename = 'main.c'
    result = search_file(os.getcwd(), filename)
    header_list = search_for_includes(result)
    header_list.insert(len(header_list), result)
    header_list = convert_to_include(header_list)
    tokens_tuple = lex(header_list)
    function_map_dict = get_function_dict(tokens_tuple)
    func_list = create_list_for_tree(function_map_dict, tokens_tuple)
    tree_root = build_tree(func_list)
    shutil.rmtree('uploads')
    return json.dumps(tree_root,indent=2)

@app.route('/upload-file', methods=['POST'])
def upload():
    file = request.files['file']
    if file:
        filename = secure_filename(file.filename)
        if not os.path.exists("uploads"):
            os.makedirs("uploads")
        # Save the file to the directory
        file.save(os.path.join("uploads", filename))
        return jsonify({'message': 'File uploaded successfully'})
    else:
        return jsonify({'error': 'No file found'})

if __name__ == '__main__':
    app.run(debug=True)
