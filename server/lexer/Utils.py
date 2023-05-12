from Parser_utils import *

RE_RESERVED_WORDS = [r'while',
                     r'do',
                     r'for',
                     r'if',
                     r'else',
                     r'switch',
                     r'case',
                     r'break',
                     r'continue',
                     r'union',
                     r'default',
                     r'typedef',
                     r'#ifndef',
                     r'#endif',
                     r'struct',
                     r'typedef',
                     r'enum',
                     r'sizeof',
                     r'#include',
                     r'#define',
                     r'#if',
                     r'#endif',
                     r'goto,'
                     r'#elif',
                     r'#else',
                     r'return']
RE_VARIABLES_TYPE = [r'int', r'long', r'short', r'double',
                     r'char', r'float', r'auto', r'void', r'FILE']
RE_MODIFIER = [r'const', r'signed', r'unsigned',
               r'static', r'volatile', r'register', r'extern']
RE_ARITHMETIC_OPERATOR = [r'-', r'+', r'/', '*', r'%']
RE_UNARY_OPERATOR = [r'++', r'--']  #
RE_RELATIONAL_OPERATOR = [r'<=', r'<', r'>=', r'>', r'==', r'!=']
RE_ASSIGNMENT = [r'&=', r'^=', r'|=', r'<<=', r'>>=',
                 r'~=', r'=', r'-=', r'+=', r'/=', '*=', r'%=']
RE_LOGICAL_OPERATOR = [r'&&', r'||']
RE_BITWISE_OPERATOR = [r'&', r'^', r'|', r'<<', r'>>', r'~']
RE_Special_Characters = ['?', ':']
RE_String = ['\'', r'"']
RE_lPAREN = r'('
RE_rPAREN = r')'
RE_lBRACKET = r'{'
RE_rBRACKETS = r'}'
RE_comma = r','
RE_number = r'-?\d+(\.\d+)?'
RE_lSQUARE_BRACKET = r']'
RE_rSQUARE_BRACKET = r'['
RE_Headers = r'#include *"([^"]+[a-zA-Z]+\.[h])"'
RE_Identifiers = r'[a-zA-Z_.][a-zA-Z0-9_.]*'
RE_Function = r'[a-zA-Z_][a-zA-Z0-9_]*\('
RE_Semicolon = r';'
RE_Arrow = r'->'
RE_Ampersand = r'&[a-zA-Z]'
RE_NOT = r'!'


# -----------------------------------------------------------------------------------------------------------------


class Define:
    def __init__(self, name: str, expression: str, text_pointer: int):
        self.name = name
        self.expression = expression
        self.text_pointer = text_pointer

    def __str__(self):
        return f' name : {self.name} | expression : {self.expression}'


class Token:
    def __init__(self, t_id: str, value: str, line_number: int, parent_file: str):
        self.id = t_id
        self.value = value
        self.line_number = line_number
        self.file = parent_file

    def __str__(self):
        return f' id : {self.id} | value : {self.value} | line number : {self.line_number} | parent file : {self.file} '


class Typedef:
    def __init__(self, name: str, term: str, text_pointer: int):
        self.name = name
        self.term = term
        self.text_pointer = text_pointer

    def __str__(self):
        return f' name:  {self.name} | term: {self.term}'


class Include:
    def __init__(self, header: str, code: str):
        self.header = header
        self.code = code

    def __str__(self):
        return f' name:  {self.header} | father: {self.code}'


class Variable(dict):
    def __init__(self, identifier: str, type: str, modifier: str):
        super().__init__()
        self.__dict__ = self
        self.identifier = identifier
        self.type = type
        self.modifier = modifier

    def __str__(self):
        return f"name : {self.identifier} | type : {self.type} | modifier : {self.modifier}"


class Function_Token:
    def __init__(self, name: str, start_pointer: int, end_pointer: int, return_value: str,
                 identifier_list: list[Variable], inside_file: str):
        self.name = name
        self.start_pointer = start_pointer
        self.return_value = return_value
        self.end_pointer = end_pointer
        self.identifier_list = identifier_list
        self.inside_file = inside_file

    def __str__(self):
        string = f'name : {self.name} | inside file : {self.inside_file} start pointer : {self.start_pointer} end ' \
                 f'pointer : {self.end_pointer} return value : {self.return_value} | identifiers:\n '
        for identifier in self.identifier_list:
            string += f'{identifier}\n'
        string += f'----------------'
        return string


class Function_Data(dict):
    def __init__(self, function_name: str, params: list[Variable], if_statements: int, while_statements: int, variables: list[Variable], return_type: str, inside_file: str, identifier_instance_dict, identifier_type_dict, built_in_function, for_statements):
        super().__init__()
        self.__dict__ = self
        self.function_name = function_name
        self.params = params
        self.built_in_function = built_in_function
        self.if_statements = if_statements
        self.while_statements = while_statements
        self.variables = variables
        self.return_type = return_type
        self.for_statements = for_statements
        self.inside_file = inside_file
        self.identifier_instance_dict = identifier_instance_dict
        self.identifier_type_dict = identifier_type_dict

    def __str__(self):
        return f'\n{self.function_name} :{self.params.__str__()}\n --------------------------------------------------------------------------------------------------------------------\n{self.variables.__str__()}'


function_list: list[Function_Token] = list()
function_dict: dict[str, int] = dict()

define_list: list[Define] = list()
define_dictionary: dict[str, int] = dict()

typedef_dictionary: dict[str, int] = dict()
typedef_list: list[Typedef] = list()

header_files_list = list()
