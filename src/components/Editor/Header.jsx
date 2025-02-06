const EditorHeader = ({ title, setTitle }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <input
          type="text"
          value={title}
          placeholder='Untitled document'
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold text-gray-900 w-full focus:outline-none border-none bg-transparent"
        />
      </div>
    </header>
  )
}

export default EditorHeader