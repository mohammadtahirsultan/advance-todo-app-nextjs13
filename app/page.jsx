import React, { Suspense } from "react";
import Form from "./addToDoForm";
import Todos from "./todos";
const Page = async () => {

  return (
    <div className="container">
      <Form />

      <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop:"20" }}>loading...</div>}>
        <section className="todosContainer">
          <Todos />
        </section>
      </Suspense>

    </div>
  );
};

export default Page;
