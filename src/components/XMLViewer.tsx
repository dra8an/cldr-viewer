/**
 * XMLViewer - Split pane container for tree and detail views
 */

import { Panel, Group, Separator } from 'react-resizable-panels';
import { TreePanel } from './TreePanel';
import { DetailPanel } from './DetailPanel';

export function XMLViewer() {
  return (
    <div className="h-screen flex flex-col">
      {/* Split Panel Container */}
      <div className="flex-1 overflow-hidden">
        <Group orientation="horizontal">
          {/* Left Panel - Tree View */}
          <Panel defaultSize={40} minSize={25}>
            <TreePanel />
          </Panel>

          {/* Resize Handle */}
          <Separator className="w-1 bg-gray-200 hover:bg-blue-500 transition-colors cursor-col-resize" />

          {/* Right Panel - Details */}
          <Panel defaultSize={60} minSize={30}>
            <DetailPanel />
          </Panel>
        </Group>
      </div>
    </div>
  );
}
