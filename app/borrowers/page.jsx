import Link from "next/link";

export default function BorrowersHome() {
  return (
    <div>
      
      <h2>Manage borrowers</h2>
      <p >What would you like to do?</p>

      <div className="row g-4">

        {/* View Borrowers */}
        <div className="col-md-6 col-xl-3">
          <div className="card text-white bg-primary h-100" >
            <div className="card-body">
              <h5 className="card-title">View all Borrowers</h5>
              <p className="card-text">See a list of all borrowers</p>
              <Link href={"/borrowers/list"} className="btn btn-light btn-sm">View Borrowers</Link>              
            </div>
          </div>
        </div>

        {/* Add Borrower */}
        <div className="col-md-6 col-xl-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Add a borrower</h5>
              <p className="card-text">Post a new borrower</p>
              <Link href={"/borrowers/add"} className="btn btn-light btn-sm">Add Borrower</Link>
              
            </div>
          </div>
        </div>

          
        {/* Issue Book */}
        <div className="col-md-6 col-xl-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Issue a book</h5>
              <p className="card-text">Lend a book to a borrower</p>
              <Link href={"/borrowers/issue"} className="btn btn-light btn-sm">Issue Book</Link>
            </div>
          </div>
        </div>

        
        {/* Return book */}
        <div className="col-md-6 col-xl-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Return a borrowed Book</h5>
              <p className="card-text">Receive a book from the borrower</p>
              <Link href={"/borrowers/return"} className="btn btn-light btn-sm">Return Book</Link>
            </div>
          </div>
        </div>        


      </div>

      <div className="banner mt-4"></div>
      

    </div>
  );
}
