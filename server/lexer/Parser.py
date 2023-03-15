from Utils import *

'''
============================================================================================
General : get_function_dict - maps the function
Parameters : token_tuple : entire tokens tuple
Return Value : return dictionary for function and position
============================================================================================
'''


def get_function_dict(token_tuple: tuple) -> dict[str, int]:
    tree_dict = dict()
    i = 0
    while i < len(token_tuple):
        if isinstance(token_tuple[i], Function_Token):
            tree_dict[token_tuple[i].name] = i
        i += 1
    return tree_dict


'''
============================================================================================
General : insert - insert to queue
Parameters : current_func : current function name , queue : queue for the function , function_map_dict : function dictionary , token_tuple : entire token tuple
Return Value : return function mapping list
============================================================================================
'''


def insert(current_func: str, queue: Queue, function_map_dict: dict[str, int], token_tuple: tuple) -> Function_call:
    i = function_map_dict[current_func]
    end = token_tuple[i].end_pointer
    file = token_tuple[i].inside_file
    func_list = Function_call(current_func, file)
    i += 1
    while i < len(token_tuple) and isinstance(token_tuple[i], Token) and token_tuple[i].line_number <= end:
        if token_tuple[i].id == 'function_call':
            queue.enqueue(token_tuple[i].value)
            func_list.__add__(token_tuple[i].value)
        i += 1
    return func_list


'''
============================================================================================
General : create_list_for_tree - create all function mapping list
Parameters : function_map_dict : function calls dictionary , token_tuple : entire tokens tuple
Return Value : return list of function calls
============================================================================================
'''


def create_list_for_tree(function_map_dict: dict[str, int], token_tuple: tuple) -> list:
    queue = Queue()
    queue.enqueue('main')
    func_list = []
    while not queue.isEmpty():
        current_func = queue.dequeue()
        func_list.append(insert(current_func, queue,
                                function_map_dict, token_tuple))
    return func_list


'''
============================================================================================
General : build_tree - build the tree
Parameters : func_list : all function calls
Return Value : return function map tree
============================================================================================
'''


def build_tree(func_list: list[Function_call]) -> Node:
    root = Node('root', func_list[0].parent, func_list[0].file)
    for func in func_list:
        node = find_node(root, func.parent)
        node.insert_child(func.parent, func.child, func.file)
    hexadecimal = ["#" + ''.join([random.choice('ABCDEF0123456789') for i in range(6)])]
    color_dict[root.file] = hexadecimal
    root.color = color_dict[root.file]
    assign_file(root)
    return root


'''
============================================================================================
General : find_node - finds node in tree
Parameters : root : tree root , node_name : node name we search for
Return Value : return the node
============================================================================================
'''


def find_node(root: Node, node_name: str) -> Node:
    if root.name == node_name:
        return root
    for child in root.children:
        result = find_node(child, node_name)
        if result:
            return result


'''
============================================================================================
General : assign_file - assign for each node its file and color
Parameters : root : tree root 
Return Value : return the root
============================================================================================
'''


def assign_file(root):
    for child in root.children:
        assign_file(child)
        child.file = function_list[function_dict[child.name]].inside_file
        if child.file in color_dict:
            child.color = color_dict[child.file]
        else:
            hexadecimal = ["#" + ''.join([random.choice('ABCDEF0123456789') for i in range(6)])]
            color_dict[child.file]= hexadecimal
            child.color = color_dict[child.file]


