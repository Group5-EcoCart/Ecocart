export default function Search() {
  return (
    <div className="d-flex align-items-center px-3 py-2 search-container">
      <img src="/Images/Search.png" alt="search" width="20" className="me-2"/>
      <input type="text" className="search-input" placeholder="Search" />
    </div>
  );
}
