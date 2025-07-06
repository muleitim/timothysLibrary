import Link from "next/link";

export default function BooksPage() {
  return (
    <div>
      
      <h2>Book Management</h2>
      <p >What would you like to do?</p>

      <div className="row g-4">

        {/* Add Book */}
        <div className="col-md-6 col-xl-3">
          <div className="card text-white bg-primary h-100" >
            <div className="card-body">
              <h5 className="card-title">Add New Book</h5>
              <p className="card-text">Upload a new book</p>
              <Link href={"/books/addBook"} className="btn btn-light btn-sm">Add</Link>              
            </div>
          </div>
        </div>

        {/* View Books */}
        <div className="col-md-6 col-xl-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">View all Books</h5>
              <p className="card-text">Get a list of all books</p>
              <Link href={"/books/list"} className="btn btn-light btn-sm">View Books</Link>
              
            </div>
          </div>
        </div>

        {/* Update Book */}
        <div className="col-md-6 col-xl-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Update Book List</h5>
              <p className="card-text">Change book details</p>
              <Link href={"/books/update"} className="btn btn-light btn-sm">Update Books</Link>
            </div>
          </div>
        </div>

        {/* Search Book */}
        <div className="col-md-6 col-xl-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Search for Book</h5>
              <p className="card-text">Find a specific book</p>
              <Link href={"/books/search"} className="btn btn-light btn-sm">Find Book</Link>
            </div>
          </div>
        </div>


      </div>

      <div className="banner mt-4"></div>
      

    </div>
  );
}
