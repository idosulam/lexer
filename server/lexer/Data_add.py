from Utils import Token, Variable, Function_Data, function_list, function_dict

'''
============================================================================================
@brief check_for_variable - check if its a variable declaration 
@param token_tuple: list of tokens
@param i : position in list 
@param line_number : line number of suspicious variable
@return return true if its declaration or not
============================================================================================
'''


def check_for_variable(token_tuple: tuple, i: int, line_number: int) -> bool:
    while i >= 0 and token_tuple[i].line_number == line_number:
        if token_tuple[i].id == 'modifier' or token_tuple[i].id == 'type':
            i -= 1
        else:
            return False
    return True


'''
============================================================================================
@brief go_to_end - go to end of variable declaration 
@param token_tuple: list of tokens
@param i : position in list 
@return Return end position of declaration
============================================================================================
'''


def go_to_end(token_tuple: tuple, i: int) -> int:
    while i + 1 < len(token_tuple):
        if token_tuple[i + 1].value == ',' or token_tuple[i + 1].value == ';':
            return i
        i += 1
    return i


'''
============================================================================================
@brief go_to_end_assignment - go to end of assignment to value
@param token_tuple: list of tokens
@param i : position in list 
@return Return end position to the assignment
============================================================================================
'''


def go_to_end_assignment(token_tuple: tuple, i: int) -> int:
    braces = 0
    while i + 1 < len(token_tuple):
        if braces == 0 and token_tuple[i + 1].value == ',' or token_tuple[i + 1].value == ';':
            return i
        if token_tuple[i].id == 'r_paren':
            braces -= 1
        if token_tuple[i].id == 'l_paren':
            braces += 1
        i += 1
    return i


'''
============================================================================================
@brief add_variable - add variable data to each function
@param token_tuple: list of tokens
@parami : position in tuple 
@param line number : the line of the variable
@return Return list of variables
============================================================================================
'''


def add_variable(token_tuple: tuple, i: int, line_number: int) -> tuple[list[Variable], int]:
    modifier = ''
    type = ''
    variables = list()
    while i < len(token_tuple) and token_tuple[i].line_number == line_number:
        if token_tuple[i].id == 'modifier':
            modifier += token_tuple[i].value + ' '
        elif token_tuple[i].id == 'type' or token_tuple[i].id == 'pointer':
            type += token_tuple[i].value + ' '
        if token_tuple[i].id == 'identifier':
            variables.append(Variable(token_tuple[i].value, type, modifier))
            if i + 1 < len(token_tuple) and token_tuple[i + 1].id == 'assignment_op':
                i = go_to_end_assignment(token_tuple, i)
            else:
                i = go_to_end(token_tuple, i)

        i += 1

    return variables, i


'''
============================================================================================
@brief find_built_in_functions - finds all builtin functions
@param token_tuple: list of tokens
@param start : starting position of function in tuple 
@param end : starting position of function in tuple 
@param inside_file : name of file is being checked
@return Return array with names of builtin functions
============================================================================================
'''


def find_built_in_functions(token_tuple: tuple, start: int, end: int, inside_file: str) -> list[str]:
    built_in_functions = list()
    while start < len(token_tuple) and isinstance(token_tuple[start], Token) and token_tuple[start].line_number <= end and token_tuple[start].file == inside_file:
        if token_tuple[start].id == 'builtin_func':
            if token_tuple[start].value not in built_in_functions:
                built_in_functions.append(token_tuple[start].value)
        start += 1
    return built_in_functions


'''
============================================================================================
@brief add_data - add data to each function
@param token_tuple: list of tokens
@param function_map_dict : functions position in the list
@return Return array with data about each function
============================================================================================
'''


def add_data(token_tuple: tuple, function_map_dict: dict) -> list[Function_Data]:
    function_data_list = list()
    for k in function_map_dict.keys():
        i = function_map_dict[k]
        end = token_tuple[i].end_pointer
        inside_file = token_tuple[i].inside_file
        i += 1
        if_statements = 0
        while_statements = 0
        for_statements = 0
        variables_list = list()
        while i < len(token_tuple) and isinstance(token_tuple[i], Token) and token_tuple[i].line_number <= end and token_tuple[i].file == inside_file:
            if token_tuple[i].value == 'if':
                if_statements += 1
            if token_tuple[i].value == 'while':
                while_statements += 1

            if token_tuple[i].value == 'for':
                for_statements += 1
            if token_tuple[i].id == 'modifier' or token_tuple[i].id == 'type':
                if check_for_variable(token_tuple, i, token_tuple[i].line_number):
                    variables, i = add_variable(token_tuple, i, token_tuple[i].line_number)
                    variables = list(filter(lambda var: var is not None, variables))
                    variables_list.extend(variables)
                    continue
            i += 1
        built_in_function = find_built_in_functions(token_tuple, function_map_dict[k] + 1, end, inside_file)
        identifier_instance_dict = count_instances_of_identifiers(token_tuple, function_map_dict[k] + 1, end, inside_file)
        identifier_type_dict = count_variable_type(variables_list, function_list[function_dict[k]].identifier_list)
        function_data_list.append(Function_Data(k, function_list[function_dict[k]].identifier_list, if_statements, while_statements, variables_list, function_list[function_dict[k]].return_value, inside_file, identifier_instance_dict, identifier_type_dict, built_in_function, for_statements))
    return function_data_list


'''
============================================================================================
@brief count_instances_of_identifiers - counts the amount of instances of every identifier
@param token_tuple: list of tokens, index : position in tuple , end : last position in tuple , inside_file : name of file is being checked
@return dictionary with count of instances for every identifier
============================================================================================
'''


def count_instances_of_identifiers(token_tuple, index, end, inside_file):
    identifier_dict = dict()
    while index < len(token_tuple) and isinstance(token_tuple[index], Token) and token_tuple[index].line_number <= end and token_tuple[index].file == inside_file:
        if token_tuple[index].id == 'identifier':
            if token_tuple[index].value not in identifier_dict:
                identifier_dict[token_tuple[index].value] = 1
            else:
                identifier_dict[token_tuple[index].value] += 1
        index += 1

    return identifier_dict


'''
============================================================================================
@brief count variable types - counts the amount of types in function
@param variables_list: list of tokens, function_parameters : function parameters
@return dictionary with count of variable types in function
============================================================================================
'''


def count_variable_type(variables_list, function_parameters):
    variable_type = dict()
    for i in range(len(variables_list)):
        if variables_list[i].type not in variable_type:
            variable_type[variables_list[i].type] = 1
        else:
            variable_type[variables_list[i].type] += 1
    for i in range(len(function_parameters)):
        if function_parameters[i].type not in variable_type:
            variable_type[function_parameters[i].type] = 1
        else:
            variable_type[function_parameters[i].type] += 1
    return variable_type
