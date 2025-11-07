import React, { useState } from "react";
import { Navigate } from "react-router";
import Loader from "~/components/Loader";
import { useAuth } from "~/context/AuthContext";
import Books from "~/components/dashboard/Books";
import "~/styles/loader.css";
import { type Book } from "~/types/book.type";
import AddBook from "~/components/dashboard/AddBookButton";

const Dashboard: React.FC = () => {
  const auth = useAuth();

  if (auth.checking) {
    return <Loader />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  
  const templateBooks : Book[] = [
    {
      "id": 1,
      "author": "teste",
      "genre": ["Fantasy", "Adventure"],
      "title": "tteste",
      "status": "READING",
      "description": "This is a detailed description of the proceding book. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed egestas odio. Suspendisse vehicula, risus et consectetur laoreet, est elit malesuada libero, ut finibus arcu est eget ante. Nunc ante nisi, tincidunt in leo vitae, tristique feugiat velit. Donec volutpat, ligula eu congue accumsan, metus ex interdum tellus, a aliquam."
    },
    {
      "id": 2,
      "author": "teste2",
      "genre": ["Biography"],
      "title": "tteste2",
      "status": "READING",
      "description": "description2"
    },
    {
      "id": 3,
      "author": "teste3",
      "genre": ["Adventure"],
      "title": "tteste3",
      "status": "READING",
      "description": "description3"
    }
  ]

  const [books, setBooks] = useState<Book[]>(templateBooks);


  return (
    <div className="p-6">
      <div className="bg-[var(--secondary)]/40 p-6 rounded-md shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-[var(--text)]">Litly</h3>
        <div className="bg-[var(--primary)]/40 p-6 rounded-md shadow-md">
          
        <Books books={books}/>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;