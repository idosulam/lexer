import React, { useEffect, useState } from 'react';

function Graph(props) {
  const [jsonTree, setJsonTree] = useState(null);
   
  class Tree{
    constructor(parent,name,file){
      this.parent = parent;
      this.name = name;
      this.file = file;
      this.childrens = [];
    }
  
    addSon(son) {
      this.childrens.push(son);
    }

   }
   let root;
   root = new Tree('root','main','main.c')
  const func1 = new Tree('main','func1','arp.c');
   let func2 = new Tree('main','func2','arp.c');
   root.addSon(func1);
   root.addSon(func2);
   func2.addSon(new Tree('func1','func3','proc.c'));


useEffect(()=>{
setJsonTree(props.tree);

}, [jsonTree,props.tree,root]);




return (
<div>
  <h1>Graph</h1>
</div>
);
}

export default Graph;