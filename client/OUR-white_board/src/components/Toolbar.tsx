type ToolbarProps = {
  addRectangle: () => void;
  addText: () => void;
  toggleConnectMode: () => void;
};

const Toolbar = ({
  addRectangle,
  addText,
  toggleConnectMode,
}: ToolbarProps) => {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 flex gap-4 shadow-xl">

      <button
        onClick={addRectangle}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
      >
        Rectangle
      </button>

      <button
        onClick={addText}
        className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white"
      >
        Text
      </button>

      <button
        onClick={toggleConnectMode}
        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white"
      >
        Connect
      </button>

    </div>
  );
};

export default Toolbar;