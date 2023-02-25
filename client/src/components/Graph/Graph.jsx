import React, { useEffect} from 'react';


function Graph(props) {
  const jsonTree =props.tree;
 
  useEffect(()=>{
  console.log(jsonTree);

  }, [jsonTree]);

  return (
    <div>
      <h1>Graph</h1>

    </div>
  );
}

export default Graph;
