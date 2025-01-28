import ReactFlow, { Background, Controls, Edge, Node, ReactFlowProvider, useReactFlow } from 'reactflow';
import React, { useRef, useState, useEffect } from 'react';

interface ChartPageProps {
  nodes: Node[];
  edges: Edge[];
  positivemode: boolean;
}
const FlowComponent = ({ nodes = [], edges, positivemode }: ChartPageProps) => {
  const { setCenter } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filteredNodes, setFilteredNodes] = useState<Node[]>(nodes); 
  const [lastBlinkingNode, setLastBlinkingNode] = useState<Node | null>(nodes.length > 0 ? nodes[0] : null); // Handle empty nodes array

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  useEffect(() => {
    if (nodes.length > 0) {
      const firstNode = nodes[0];
      const blinkingNode = nodes
        .filter((node) => node.className === 'blinking-node')
        .pop() || firstNode;
        
      setLastBlinkingNode(blinkingNode); 

      if (positivemode) {
        setFilteredNodes(nodes.filter((node) => node.className !== 'lowScore'));
      } else {
        setFilteredNodes(nodes);
      }
    }
  }, [nodes, positivemode]);

  useEffect(() => {
    if (lastBlinkingNode) {
      setCenter(lastBlinkingNode.position.x, lastBlinkingNode.position.y, { zoom: 1 });
    }
  }, [lastBlinkingNode, setCenter]);

  return (
    <ReactFlow nodes={filteredNodes} edges={edges} fitView onNodeClick={onNodeClick}>
      <Background offset={0} lineWidth={0} />
      <Controls />
      {selectedNode && (
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            padding: '5px',
            margin: '10px',
            marginLeft: '40px',
            maxWidth: '90%',
            marginTop: '100px',
            border: '1px solid black',
            zIndex: 10,
          }}
        >
          <strong>{selectedNode.data.label}</strong>
          <p>{selectedNode.data.hoverInfo2}</p>
          <p>{selectedNode.data.hoverInfo}</p>
        </div>
      )}
    </ReactFlow>
  );
};

const ChartPage: React.FC<ChartPageProps> = ({ nodes, edges, positivemode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const enterFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div style={{ position: 'relative', height: '90vh' }}>
      <div
        ref={containerRef}
        className="containerFlow"
        style={{
          height: '100%',
          border: '0px solid black',
          backgroundColor: '#FFFFFF',
        }}
      >
        <ReactFlowProvider>
          <FlowComponent nodes={nodes} edges={edges} positivemode={positivemode} />
        </ReactFlowProvider>
      </div>
      <button
        onClick={enterFullscreen}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 10,
          padding: '10px',
          backgroundColor: '#F3969A',
          cursor: 'pointer',
        }}
      >
        フルスクリーン
      </button>
    </div>
  );
};

export default ChartPage;
