import os
import re
import copy
import json
import random


class Node(dict):
    def __init__(self, parent: str, name: str, file: str):
        super().__init__()
        self.__dict__ = self
        self.parent: str = parent
        self.name: str = name
        self.file: str = file
        self.color: str = ''
        self.children: list[Node] = []

    def insert_child(self, name, data, file):
        for da in data:
            if da != self.parent:
                self.children.append(Node(name, da, file))

    def __str__(self):
        return f'name {self.name} children {self.children}'


class Queue:
    def __init__(self):
        self.items = list()

    def isEmpty(self):
        return self.items == []

    def enqueue(self, item):
        if item not in self.items:
            self.items.append(item)

    def dequeue(self):
        return self.items.pop(0)

    def size(self):
        return len(self.items)

    def __str__(self):
        return self.items.__str__()


class Function_call:
    def __init__(self, parent: str, file: str):
        self.parent = parent
        self.child: list[str] = list()
        self.file = file

    def __add__(self, data):
        if not self.child.__contains__(data):
            self.child.append(data)

    def __str__(self):
        return f'parent : {self.parent} | children : {self.child} | len : {len(self.child)}'


color_dict = dict()
