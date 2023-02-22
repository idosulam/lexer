import json
from Lexer import *
from Parser import *
from flask import *
from flask_cors import CORS
import shutil
from werkzeug.utils import secure_filename
from Data_add import *

app = Flask(__name__)
CORS(app)


@app.route('/tree', methods=['GET'])
def generate_tree():
    filename = search_files_for_main()
    result = search_file(os.getcwd(), filename)
    header_list = search_for_includes(result)
    header_list.insert(len(header_list), result)
    header_list = convert_to_include(header_list)
    tokens_tuple = lex(header_list)
    function_map_dict = get_function_dict(tokens_tuple)
    func_list = create_list_for_tree(function_map_dict, tokens_tuple)
    tree_root = build_tree(func_list)
    return json.dumps(tree_root, indent=2)


@app.route('/get-data', methods=['GET'])
def get_data():
    filename = search_files_for_main()
    result = search_file(os.getcwd(), filename)
    header_list = search_for_includes(result)
    header_list.insert(len(header_list), result)
    header_list = convert_to_include(header_list)
    tokens_tuple = lex(header_list)
    function_map_dict = get_function_dict(tokens_tuple)
    data_list = add_data(tokens_tuple, function_map_dict)
    shutil.rmtree('uploads')
    return json.dumps(data_list, indent=2)


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
    app.run()
