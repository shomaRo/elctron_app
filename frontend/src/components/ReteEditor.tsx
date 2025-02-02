import React, { useEffect, useRef } from "react";
import { NodeEditor, Component, NodeData, WorkerInputs, WorkerOutputs, Output, Socket } from "rete";
import AreaPlugin from "rete-area-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ReactRenderPlugin from "rete-react-render-plugin";

export const ReteEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    async function initializeEditor() {
      if (!containerRef.current) return;

      const editor = new NodeEditor("demo@0.1.0", containerRef.current);
      editor.use(AreaPlugin);
      editor.use(ConnectionPlugin);
      editor.use(ReactRenderPlugin);

      const numSocket = new Socket("Number");

      class NumberComponent extends Component {
        constructor() {
          super("Number");
        }

        async builder(node: NodeData) {
          node.data = {};
          node.addOutput(new Output("num", "Number", numSocket));
          return Promise.resolve();
        }

        worker(node: NodeData, inputs: WorkerInputs, outputs: any, ...args: unknown[]) {
          outputs["num"] = node.data.value || 0;
        }
      }

      const numberComponent = new NumberComponent();
      editor.register(numberComponent);

      const node = await numberComponent.createNode();
      node.position = [80, 200];
      editor.addNode(node);

      editor.view.resize();
      editor.trigger("process");
    }

    initializeEditor();
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "500px", border: "1px solid black" }} />;
};
