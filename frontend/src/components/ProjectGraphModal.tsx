import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { X, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { generateGraphData } from './ProjectGraphData';
import type { GraphData, GraphNode, GraphLink } from './ProjectGraphData';
import './ProjectGraphModal.css';

interface ProjectGraphModalProps {
  projectName: string;
  onClose: () => void;
}

export const ProjectGraphModal: React.FC<ProjectGraphModalProps> = ({ projectName, onClose }) => {
  const fgRef = useRef<any>();
  const [data, setData] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate data
    setData(generateGraphData(projectName));

    // Handle resize
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Zoom to fit after a short delay to allow graph to render
    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(400, 50);
      }
    }, 600);

    return () => window.removeEventListener('resize', updateSize);
  }, [projectName]);

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node);
    
    // Center node
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(3, 1000);
    }
  }, []);

  const getConnectedNodes = () => {
    if (!selectedNode || !data) return [];
    
    const connectedLinks = data.links.filter(
      l => (l.source as any).id === selectedNode.id || (l.target as any).id === selectedNode.id
    );
    
    return connectedLinks.map(link => {
      const isSource = (link.source as any).id === selectedNode.id;
      const connectedNode = isSource ? link.target : link.source;
      return {
        node: connectedNode as any,
        label: link.label || (isSource ? 'links to' : 'linked from')
      };
    });
  };

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 50);
    }
  }, []);

  // Custom node painting for Obsidian-like text + circle
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

    // Draw Circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = node.color;
    ctx.fill();
    
    // Highlight if selected
    if (selectedNode && selectedNode.id === node.id) {
      ctx.lineWidth = 2 / globalScale;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }

    // Draw Text Background (optional, for readability)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y + node.val / 2 + 2, bckgDimensions[0], bckgDimensions[1]);

    // Draw Text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(label, node.x, node.y + node.val / 2 + 2 + bckgDimensions[1] / 2);
    
    // Let force-graph know the bounds for hit-testing
    node.__bckgDimensions = bckgDimensions;
  }, [selectedNode]);

  if (!data) return null;

  return (
    <div className="project-graph-modal-overlay">
      <div className="project-graph-modal-content">
        
        <div className="project-graph-header">
          <div>
            <h2 className="project-graph-title">{projectName} - Architecture Graph</h2>
            <p className="project-graph-subtitle">Interactive Obsidian-style view of modules, tech stack, and contributors</p>
          </div>
          <button className="project-graph-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="project-graph-body">
          <div className="project-graph-container" ref={containerRef}>
            <ForceGraph2D
              ref={fgRef}
              width={containerSize.width}
              height={containerSize.height}
              graphData={data}
              nodeId="id"
              nodeRelSize={1}
              nodeCanvasObject={paintNode}
              nodePointerAreaPaint={(node: any, color, ctx) => {
                ctx.fillStyle = color;
                const bckgDimensions = node.__bckgDimensions;
                bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y + node.val / 2 + 2, bckgDimensions[0], bckgDimensions[1]);
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
                ctx.fill();
              }}
              linkColor={() => 'rgba(255,255,255,0.2)'}
              linkWidth={link => Math.sqrt(link.value || 1)}
              linkDirectionalParticles={2}
              linkDirectionalParticleWidth={1.5}
              linkDirectionalParticleSpeed={d => (d.value || 1) * 0.005}
              onNodeClick={handleNodeClick}
              onBackgroundClick={handleBackgroundClick}
              backgroundColor="#111111"
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.3}
            />
            
            {/* Legend */}
            <div className="graph-legend">
              <div className="graph-legend-title">Legend</div>
              <div className="graph-legend-item"><div className="graph-legend-dot" style={{background: '#8b5cf6'}}></div>Project</div>
              <div className="graph-legend-item"><div className="graph-legend-dot" style={{background: '#3b82f6'}}></div>Module</div>
              <div className="graph-legend-item"><div className="graph-legend-dot" style={{background: '#10b981'}}></div>Technology</div>
              <div className="graph-legend-item"><div className="graph-legend-dot" style={{background: '#f59e0b'}}></div>Database</div>
              <div className="graph-legend-item"><div className="graph-legend-dot" style={{background: '#ec4899'}}></div>Team Member</div>
            </div>
          </div>

          {selectedNode && (
            <div className="project-graph-sidebar">
              <div className="node-detail-type" style={{ color: selectedNode.color }}>
                {selectedNode.type} Node
              </div>
              <h3 className="node-detail-title">{selectedNode.name}</h3>
              <p className="node-detail-desc">{selectedNode.desc}</p>

              <div className="node-detail-links">
                <h4 className="node-detail-links-header">Connections</h4>
                <div className="node-detail-link-list">
                  {getConnectedNodes().map((conn, idx) => (
                    <div 
                      key={idx} 
                      className="node-detail-link-item"
                      onClick={() => handleNodeClick(conn.node)}
                    >
                      <div className="node-detail-link-dot" style={{ background: conn.node.color }}></div>
                      <span className="node-detail-link-text">{conn.node.name}</span>
                      <span className="node-detail-link-label">{conn.label}</span>
                    </div>
                  ))}
                  {getConnectedNodes().length === 0 && (
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No connections found.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
