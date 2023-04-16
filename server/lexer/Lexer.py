import re

from Utils import *

'''
============================================================================================
General : lex_define - add define 
Parameters : define_line : line of define , text_pointer : line number
Return Value :  NONE
============================================================================================
'''


def lex_define(define_line: list[str], text_pointer: int):
    if len(define_line) < 2:
        return
    if re.match(RE_Function, define_line[0]):
        print('macro not supported')
    else:
        name = define_line[0]
        if name not in define_dictionary:
            expression = value_assignment(define_line[1:])
            define_list.append(Define(name, expression, text_pointer))
            define_dictionary[name] = len(define_list) - 1


'''
============================================================================================
General : find_typedef - finds typedef
Parameters : typedef : file_text , text_pointer : line number
Return Value :  NONE
============================================================================================
'''


def find_typedef(typedef: list[str], text_pointer: int):
    i = 0
    term = ''
    while i < len(typedef) - 2:
        term += typedef[i] + ' '
        i += 1
    name = typedef[len(typedef) - 2]  # len -1 is ;
    if name not in typedef_dictionary:
        typedef_list.append(Typedef(name, term, text_pointer))
        typedef_dictionary[name] = len(typedef_list) - 1


'''
============================================================================================
General : value_assignment - finds expression
Parameters : math : file_text 
Return Value :  expression string
============================================================================================
'''


def value_assignment(math: list[str]) -> str:
    math_expression = ''
    for x in math:
        math_expression += x + ' '
    math = math_expression.split()
    math_expression = ''
    i = 0
    while i < len(math):
        if math[i] == ',' or math[i] == ';':
            break
        if re.match(RE_Identifiers, math[i]):
            if math[i] in define_dictionary:
                define = define_list[define_dictionary[math[i]]]
                math_expression += str(define.expression) + ' '
            else:
                math_expression += str(math[i]) + ' '
        else:
            if math[i] == '^':
                math_expression += '**' + ' '
            else:
                math_expression += math[i] + ' '
        i += 1
    return math_expression


'''
============================================================================================
General : openfile - opens file
Parameters : path : path 
Return Value :  file
============================================================================================
'''


def openfile(path: str):
    f = None
    try:
        f = open(path, "r")
    finally:
        if f is None:
            print(f'Could not open file:  {path}')
            exit(1)
    return f

'''
============================================================================================
General : add_struct_aliases - adds struct aliases to types
Parameters : text : file text , text_pointer : points to text position
Return Value :  names of struct
============================================================================================
'''
def add_struct_aliases(text, text_pointer):
        i = 1
        struct_alias_array = list()
        struct_line = text[text_pointer].split()
        while i < len(struct_line):
            if re.match(RE_Identifiers,struct_line[i]):
                struct_alias_array.append(struct_line[i])
            i += 1
        return struct_alias_array

'''
============================================================================================
General : find_struct - finds structs and adds them to list
Parameters :  text : file_text , text_pointer : line number
Return Value :  text_pointer
============================================================================================
'''


def find_struct(text, text_pointer):
    struct_list = list()
    line = text[text_pointer].split()
    i = 1
    bracket = 0
    struct_string = ''
    while i < len(line):
        if line[i] != '{':
            struct_string += line[i] + ' '
        else:
            bracket += 1
        i += 1
    text_pointer += 1
    struct_list.append(struct_string)
    if bracket != 1:
        flag = True
        while text_pointer < len(text) and flag:
            line = text[text_pointer]
            if '{' in line:
                flag = False
            text_pointer += 1

    flag = True
    while text_pointer < len(text) and flag:
        line = text[text_pointer]
        if '}' in line:
            struct_list.extend(add_struct_aliases(text, text_pointer))
            RE_VARIABLES_TYPE.extend(struct_list)
            flag = False
        text_pointer += 1

    return text_pointer


'''
============================================================================================
General : find_replace_typedef_define - change typedef
Parameters : text : file text
Return Value : return text after change
============================================================================================
'''


def find_replace_typedef_define(text: list[str]) -> list[str]:
    global typedef_list
    text_pointer = 0
    while text_pointer < len(text):
        line = text[text_pointer]
        line = line.split(' ')
        if len(line) == 0:
            text_pointer += 1
            continue
        if line[0] == r'typedef':
            if not re.match(r'struct', line[1]):
                find_typedef(line[1:], text_pointer)
            else:

                text_pointer = find_struct(text, text_pointer)
        if line[0] == r'#define':
            lex_define(line[1:], text_pointer)
        text_pointer += 1
    text_pointer = 0
    while text_pointer <= len(text) - 1:
        line = text[text_pointer]
        line = line.split()
        i = 0
        while i < len(line) - 1:
            if line[i] in define_dictionary.keys():
                define = define_list[define_dictionary[line[i]]]
                if define.text_pointer != text_pointer:
                    text[text_pointer] = text[text_pointer].replace(
                        line[i], define.expression)
            if line[i] in typedef_dictionary.keys():
                typedef = typedef_list[typedef_dictionary[line[i]]]
                if typedef.text_pointer != text_pointer:
                    text[text_pointer] = text[text_pointer].replace(
                        line[i], typedef.term)
            i += 1
        text_pointer += 1
    return text


'''
============================================================================================
General : get_files_in_path - return all files path
Parameters : path : path to folder
Return Value : all files in path
============================================================================================
'''


def get_files_in_path(path):
    files = []
    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)
        if os.path.isfile(file_path):
            files.append(filename)
    return files


'''
============================================================================================
General : search_files_for_main - search main file
Parameters : 
Return Value : main file name
============================================================================================
'''


def search_files_for_main():
    for filename in get_files_in_path("test"):
        with open(os.path.join("test", filename), 'r') as f:
            contents = f.read()
            pattern = re.compile("main\(")
            if re.search(pattern, contents):
                return filename


# closes the file
def close_file(file):
    file.close()


'''
============================================================================================
General : get_text - manipulate text
Parameters : file : file
Return Value : file text after manipulation
============================================================================================
'''


def get_text(file) -> list[str]:
    separate = [';', ',', '{', '}', ')', '&&', '!', '^', '|',
                '<<', '>>', '~', '"', '\'', '*', '+', '-', '/', '[', ']', ':', '++', '--']
    text = file.read().split('\n')
    for i in range(len(text)):
        for sep in separate:
            text[i] = text[i].replace(sep, f' {sep} ')
            if sep == '-':
                text[i] = text[i].replace('- >', ' -> ')
                text[i] = text[i].replace(' -  - ', ' -- ')
                text[i] = text[i].replace(' - = ', ' -= ')
            if sep == '+':
                text[i] = text[i].replace(' +  + ', ' ++ ')
            if sep == '*':
                text[i] = text[i].replace(' * = ', ' *= ')
            if sep == '%':
                text[i] = text[i].replace(' % = ', ' %= ')
            if sep == '/':
                text[i] = text[i].replace(' / = ', ' /= ')
            if sep == '>>':
                text[i] = text[i].replace(' >> = ', ' >>= ')
            if sep == '<<':
                text[i] = text[i].replace(' << = ', ' <<= ')
            if sep == '!':
                text[i] = text[i].replace(' ! = ', ' != ')
            if sep == '~':
                text[i] = text[i].replace(' ~ = ', ' ~= ')
            if sep == '^':
                text[i] = text[i].replace(' ^ = ', ' ^= ')
            if sep == '&':
                text[i] = text[i].replace(' & = ', ' &= ')
    return text


'''
============================================================================================
General : find_library_includes - search for all includes by regex
Parameters : file : text code 
Return Value : list of includes name
============================================================================================
'''


def find_library_includes(file: str) -> list[str]:
    with open(file, 'r') as f:
        contents = f.read()

    library_includes = re.findall(RE_Headers, contents)
    return library_includes


'''
============================================================================================
General : search_for_includes - search for all files by the given include
Parameters : file : text code 
Return Value : list of headers
============================================================================================
'''


def search_for_includes(file: str) -> list[str]:
    # Find all library includes in the file
    includes = find_library_includes(file)
    # For each include, search for includes in that file
    for include in includes:
        result = search_file(os.getcwd(), include)
        search_for_includes(result)
        if result not in header_files_list:
            header_files_list.append(result)
    return header_files_list


'''
============================================================================================
General : get_code_file - name of ffile code
Parameters : cfile : header file
Return Value : code file name
============================================================================================
'''


def get_code_file(cfile: str):
    pattern = re.compile(r'([^/]+)$')
    match = pattern.search(cfile)
    return match.group(1)


'''
============================================================================================
General : convert_to_include - convert code
Parameters : header_list : list of file headers 
Return Value : list of file headers and code files
============================================================================================
'''


def convert_to_include(header_list: list[str]) -> list[Include]:
    new_list = list()
    for i in range(len(header_files_list) - 1):
        if header_list[i] not in new_list:
            code_result = search_file(os.getcwd(), get_code_file(
                header_list[i].replace('.h', '.c')))
            new_list.append(Include(header_list[i], code_result))
    new_list.append(Include('none', header_list[len(header_list) - 1]))
    return new_list


'''
============================================================================================
General : lex - tokenize the code
Parameters : header_list : list of file headers and code files
Return Value : entire project tuple
============================================================================================
'''


def lex(header_list: list[Include]) -> tuple:
    header_pointer = 0
    tpl = tuple()
    while header_pointer <= len(header_list) - 1:
        if header_list[header_pointer].header != 'none':
            file = openfile(header_list[header_pointer].header)
            text = get_text(file)
            text = find_replace_typedef_define(text)
            tpl = tokenize(text, header_list[header_pointer].header, tpl)
            close_file(file)
        file = openfile(header_list[header_pointer].code)
        text = get_text(file)
        text = find_replace_typedef_define(text)
        find_functions(text, header_list[header_pointer].code)
        tpl = tokenize(text, header_list[header_pointer].code, tpl)
        close_file(file)
        header_pointer += 1
    return tpl


'''
============================================================================================
General : tokenize - tokenize code
Parameters : file_text: list of words, file_name : file name , tpl : token tuple
Return Value : token tuple
============================================================================================
'''


def tokenize(file_text: list[str], file_name: str, tpl: tuple) -> tuple:
    text_pointer = 0
    new_tpl = list()
    while text_pointer < len(file_text):
        separate = ['(', ')']
        for sep in separate:
            file_text[text_pointer] = file_text[text_pointer].replace(
                sep, f' {sep} ')
        line = file_text[text_pointer].split()
        current_line_token_list = list()
        i = 0
        flag = True
        while i < (len(line)) and flag is True:
            if i + 1 < len(line) and line[i] == '/' and line[i + 1] == '/':
                flag = False
            elif i + 1 < len(line) and line[i] == '/' and line[i + 1] == '*':
                text_pointer = end_comment(file_text, text_pointer)
                flag = False
            elif line[i] in function_dict and function_list[function_dict[line[i]]].start_pointer == text_pointer + 1:
                current_line_token_list.clear()
                current_line_token_list.append(
                    function_list[function_dict[line[i]]])
                flag = False
            else:
                # get rid of preprocessor stuff
                if re.match(r'#', line[0]):
                    flag = False
                else:
                    tokens, i = word_token(
                        line, i, file_name, text_pointer + 1)
                    current_line_token_list.extend(tokens)
            i += 1
        if len(current_line_token_list) > 0:
            current_line_token_list = list(
                filter(lambda tk: tk is not None, current_line_token_list))
            new_tpl.extend(current_line_token_list)
        text_pointer += 1
    return tpl + tuple(new_tpl)


'''
============================================================================================
General : check_identifier - check if its pointer or arithmetic
Parameters : line: list of words, position : position in list 
Return Value : pointer or arithmetic_op
============================================================================================
'''


def check_identifier(line: list[str], position: int) -> str:
    for i in range(position, -1, -1):
        if line[i] in RE_ASSIGNMENT:
            return 'arithmetic_op'
    return 'pointer'


'''
============================================================================================
General : check_for_asterisk - check if its pointer or arithmetic
Parameters : line: list of words, position : position in list 
Return Value : pointer or arithmetic_op
============================================================================================
'''


def check_for_asterisk(line: list[str], position: int) -> str:
    if position == 0:
        return 'pointer'
    if position > 0:
        if line[position - 1] in RE_lPAREN:
            return 'pointer'
        if position + 1 < len(line) and line[position + 1] in RE_rPAREN:
            return 'pointer'
        if line[position - 1] in RE_ASSIGNMENT:
            return 'pointer'
        if line[position - 1] in RE_RELATIONAL_OPERATOR:
            return 'pointer'
        if line[position - 1] in RE_UNARY_OPERATOR:
            return 'pointer'
        if line[position - 1] in RE_BITWISE_OPERATOR:
            return 'pointer'
        if line[position - 1] in RE_ARITHMETIC_OPERATOR:
            return 'pointer'
        if line[position - 1] in RE_RESERVED_WORDS:
            return 'pointer'
        if line[position - 1] in RE_VARIABLES_TYPE:
            return 'pointer'
        if line[position - 1] == RE_rPAREN or re.match(RE_number, line[position - 1]):
            return 'arithmetic_op'
        if re.match(RE_Identifiers, line[position - 1]):
            return check_identifier(line, position)
    return 'pointer'


'''
============================================================================================
General : word_token - assign token to each word
Parameters : line: list of words, position : position in list , file_name : file_name of text , text_pointer : line number in the written file 
Return Value : return token
============================================================================================
'''


def word_token(line: list[str], position: int, file_name: str, text_pointer: int) -> [list[Token], int]:
    word = line[position]
    tk = Token('', word, text_pointer, file_name)
    tok = list()
    if word in RE_RESERVED_WORDS:
        tk.id = 'reserve_word'
        if tk.value == 'typedef':
            if position + 1 < len(line) and line[position + 1] != 'struct':
                return tok, len(line)
        tok.append(tk)
        return tok, position
    if word in RE_MODIFIER:
        tk.id = 'modifier'
        tok.append(tk)
        return tok, position
    if word in RE_VARIABLES_TYPE:
        tk.id = 'type'
        tok.append(tk)
        return tok, position
    if re.match(RE_Identifiers, word):
        if position + 1 < len(line) and line[position + 1] == RE_lPAREN:
            if file_name.endswith('.h'):
                tk.id = 'declaration'
            elif word in function_dict:
                tk.id = 'function_call'
            else:
                tk.id = 'builtin_func'
            tok.append(tk)
            return tok, position
        else:
            tk.id = 'identifier'
            tok.append(tk)
            return tok, position
    if re.match(RE_number, word):
        tk.id = 'integer_literal'
        tok.append(tk)
        return tok, position
    if re.match(RE_Ampersand, word):
        tk.id = 'address'
        tk.value = word[:1]
        tk1 = Token('identifier', word[1:], text_pointer, file_name)
        tok.append(tk1)
        tok.append(tk)
        return tok, position
    if word == RE_lPAREN:
        tk.id = 'l_paren'
        tok.append(tk)
        return tok, position
    if word == RE_rPAREN:
        tk.id = 'r_paren'
        tok.append(tk)
        return tok, position
    if word == RE_lBRACKET:
        tk.id = 'l_bracket'
        tok.append(tk)
        return tok, position
    if word == RE_rBRACKETS:
        tk.id = 'r_bracket'
        tok.append(tk)
        return tok, position
    if word == RE_rSQUARE_BRACKET:
        tk.id = 'r_square'
        tok.append(tk)
        return tok, position
    if word == RE_lSQUARE_BRACKET:
        tk.id = 'l_square'
        tok.append(tk)
        return tok, position
    if word == RE_Semicolon:
        tk.id = 'semicolon'
        tok.append(tk)
        return tok, position
    if word == RE_comma:
        tk.id = 'comma'
        tok.append(tk)
        return tok, position
    if word in RE_LOGICAL_OPERATOR:
        tk.id = 'logical_op'
        tok.append(tk)
        return tok, position
    if word == RE_Arrow:
        tk.id = 'arrow'
        tok.append(tk)
        return tok, position
    if word in RE_UNARY_OPERATOR:
        tk.id = 'unary_operator'
        tok.append(tk)
        return tok, position
    if word in RE_BITWISE_OPERATOR:
        tk.id = 'bitwise_operator'
        tok.append(tk)
        return tok, position
    if word in RE_Special_Characters:
        tk.id = 'special_char'
        tok.append(tk)
        return tok, position
    if word in RE_String:
        tk.id = 'string_open'
        tok.append(tk)
        str_tk, position = get_str_tk(
            line, position + 1, text_pointer, file_name, word)
        tok.append(str_tk)
        tk2 = copy.deepcopy(tk)
        tk2.id = 'string end'
        tok.append(tk2)
        return tok, position
    if word == RE_NOT:
        tk.id = 'not'
        tok.append(tk)
        return tok, position
    if word in RE_RELATIONAL_OPERATOR:
        tk.id = 'relational_operator'
        tok.append(tk)
        return tok, position
    if word in RE_ASSIGNMENT:
        tk.id = 'assignment_op'
        tok.append(tk)
        return tok, position
    if word in RE_ARITHMETIC_OPERATOR:
        tk.id = 'arithmetic_op'
        if word == '*':
            tk.id = check_for_asterisk(line, position)
            tk.line = line
        tok.append(tk)
        return tok, position

    tk.id = 'unknown'
    tok.append(tk)
    return tok, position


'''
============================================================================================
General : get_str_tk - goes string for token
Parameters : line: list of words, position : position in list , file : file_name of text , text_pointer : line number in the written file , word : which declaration it is
Return Value : token and position
============================================================================================
'''


def get_str_tk(line: list[str], position: int, text_pointer: int, file: str, word: str) -> [list[Token], int]:
    tk = Token('string', '', text_pointer, file)
    tk_str = ''
    while position < len(line) and line[position] != word:
        tk_str += line[position] + ' '
        position += 1
    tk.value = tk_str
    return tk, position


'''
============================================================================================
General : end_comment - goes to end of comment
Parameters : file_text : file text , text_pointer : number of line
Return Value : number where comment end
============================================================================================
'''


def end_comment(file_text: list[str], text_pointer: int) -> int:
    flag = False
    while text_pointer < len(file_text) and not flag:
        line = file_text[text_pointer].split()
        i = 0
        while i < len(line) - 1 and not flag:
            if line[i] == r'*' and line[i + 1] == r'/':
                flag = True
            i += 1
        text_pointer += 1
    return text_pointer - 1


'''
============================================================================================
General : find_functions - search for functions
Parameters : text : file text , file : file number
Return Value : NONE
============================================================================================
'''


def find_functions(text: list[str], file: str):
    text_pointer = 0
    while text_pointer < len(text):
        line = text[text_pointer]
        line = line.split()
        if len(line) > 0:
            if line[0] == '/' and line[1] == '*':
                text_pointer = end_comment(text, text_pointer) + 1
                continue
            if line[0] != '/' and line[1] != '/':
                if isfunction(line, text, text_pointer):
                    text_pointer = extract_function(text, text_pointer, file)
        text_pointer += 1


'''
============================================================================================
General : check_if_function - if the declaration is after a few lines
Parameters : text : file text , text_pointer : line number
Return Value : return true if its a function or false
============================================================================================
'''


def check_if_function(text: list[str], text_pointer: int) -> bool:
    while text_pointer < len(text):
        line = text[text_pointer].split()
        for i in range(len(line)):
            if line[i] == RE_lBRACKET:
                return True
            if line[i] == ';' or line[i] == RE_rBRACKETS:
                return False
        text_pointer += 1


'''
============================================================================================
General : isfunction - checks if its a function declaration
Parameters : function_line : function declaration line , text : entire file text , text_pointer : line number
Return Value : return true if its a function or false
============================================================================================
'''


def isfunction(function_line: list[str], text: list[str], text_pointer: int) -> bool:
    i = 0
    while i < len(function_line):
        if re.match(RE_Function, function_line[i]):
            if function_line[len(function_line) - 1] == RE_lBRACKET or check_if_function(text, text_pointer):
                return True
        i += 1
    return False


'''
============================================================================================
General : extract_function - assign to each function the start of function name return type and parameters
Parameters : function_text : list of all text in file , text_pointer : line number , file : file name
Return Value : return the line where the function end
============================================================================================
'''


def extract_function(function_text: list[str], text_pointer: int, file: str) -> int:
    start_pointer = text_pointer
    function_identifiers_list = list()
    name = ''
    return_value = ''
    bracket = 1
    while text_pointer < len(function_text) and bracket:
        separate = ['(', ')']
        for sep in separate:
            function_text[text_pointer] = function_text[text_pointer].replace(
                sep, f' {sep} ')
        line = function_text[text_pointer]
        line = line.split()
        i = 0
        while i < len(line):
            if text_pointer == start_pointer:
                return_value = get_return_value(line)
                i = len(return_value.split(' '))
                function_identifiers_list = get_variables(line[i + 2:])
                name = line[i]
                while not function_text[text_pointer].__contains__('{'):
                    text_pointer += 1
                break
            match line[i]:
                case r'{':
                    bracket += 1
                case r'}':
                    bracket -= 1
            i += 1
        text_pointer += 1
    function_list.append(
        Function_Token(name, start_pointer + 1, text_pointer, return_value, function_identifiers_list, file))
    function_dict[name] = len(function_list) - 1
    return text_pointer - 1


'''
============================================================================================
General : get_return_value - assign the return type
Parameters : line : function declaration
Return Value : return string of return value
============================================================================================
'''


def get_return_value(line: list[str]) -> str:
    return_value = ''
    if line[0] != r'static':
        return_value += line[0]
    i = 1
    while i < len(line) and not line[i + 1] == RE_lPAREN:
        return_value += ' ' + line[i]
        i += 1
    return return_value


'''
============================================================================================
General : get_variables - search for parameter
Parameters : variables_line : line of declaration
Return Value : return list of variables
============================================================================================
'''


def get_variables(variables_line: list[str]) -> list[Variable]:
    variables_list = list()
    i = 0
    while i < len(variables_line) and variables_line[i] != RE_rPAREN:
        modifier = ''
        type = ''
        while i < len(variables_line) - 2 and variables_line[i + 1] != r',' and variables_line[i + 1] != RE_rPAREN:
            if variables_line[i] in RE_MODIFIER:
                modifier += variables_line[i] + ' '
            else:
                type += variables_line[i] + ' '
            i += 1

        if not [variable for variable in variables_list if variable.identifier == variables_line[i]]:
            if modifier == '':
                modifier = 'none'
            variables_list.append(Variable(variables_line[i], type, modifier))
        i += 2
    return variables_list


'''
============================================================================================
General : search_file - search for the file
Parameters : folder : path to folder , filename : the file we search 
Return Value : return path
============================================================================================
'''


def search_file(folder: str, filename: str) -> str:
    for item in os.listdir(folder):
        item_path = os.path.join(folder, item)
        if os.path.isfile(item_path) and item == filename:
            return item_path
        elif os.path.isdir(item_path):
            result = search_file(item_path, filename)
            if result is not None:
                return result
