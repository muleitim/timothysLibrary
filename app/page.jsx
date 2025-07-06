export default function Home()
{
  return (
    <div>

      <div className="container">
        <h2 className="text-center">Welcome to Tim's Library</h2>
        <p className="text-center">"To learn to read is to light a fire; every syllable that is spelled out is a spark." &mdash;Victor Hugo</p>
      </div>

      
      {/*  Cards Section */}
    <div className="container card-container mt-4 ">
        <div className="row">
          
            {/*  Card 1 */}
            <div className="col-md-4 mb-4">
                <div className="card">
                <img src="/images/book.jpg" className="card-img-top" alt="Card 1" />

                    <div className="card-body">
                        <h5 className="card-title">Books</h5>
                        <p className="card-text">Manage all book information efficiently and with ease.</p>
                        <a href={"/books"} className="btn btn-primary">Books</a>
                    </div>
                </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-4 mb-4">
                <div className="card">
                    <img src="/images/student.jpeg" className="card-img-top" alt="Card 2" />
                    <div className="card-body">
                        <h5 className="card-title">Borrowers</h5>
                        <p className="card-text">Browse and manage book borrower records.</p>
                        <a href={"/borrowers"} className="btn btn-primary">Borrowers</a>
                    </div>
                </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-4 mb-4">
                <div className="card">
                    <img src="/images/librarian.jpeg" className="card-img-top" alt="Card 3" />
                    <div className="card-body">
                        <h5 className="card-title">Librarians</h5>
                        <p className="card-text">Manage all librarian information efficiently with ease.</p>
                        <a href={"/"} className="btn btn-primary">Home</a>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div className="banner mt-4"></div>

    

    </div>
  )
}