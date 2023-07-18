const blogContainer = document.querySelector(".blog__container");
const blogModal = document.querySelector(".blog__modal__body");
let globalStore = [];

const newCard = ({
  id,
  imageUrl,
  blogTitle,
  blogType,
  blogDescription,
}) => `<div class="col-lg-4 col-md-6" id=${id}>
<div class="card m-2">
  <div class="card-header d-flex justify-content-end gap-2">
    <button type="button" class="btn btn-outline-success" id="${id}" onclick="editCard.apply(this, arguments)"><i class="fas fa-pencil-alt" id="${id}" onclick="editCard.apply(this, arguments)"></i></button>
    <button type="button" class="btn btn-outline-danger" id="${id}" onclick="deleteCard.apply(this, arguments)"><i class="fas fa-trash-alt" id="${id}" onclick="deleteCard.apply(this, arguments)"></i></button>
  </div>
  <img
    src=${imageUrl}
    class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${blogTitle}</h5>
    <p class="card-text">${blogDescription}</p>
    <span class="badge bg-primary">${blogType}</span>
  </div>
  <div class="card-footer text-muted">
    <button type="button" id="${id}" class="btn btn-outline-primary float-end" data-bs-toggle="modal" data-bs-target="#showblog" onclick="openBlog.apply(this, arguments)">Open Blog</button>
  </div>
</div>
</div>`;

const loadData = () => {
  const getInitialData = localStorage.getItem("blog");
  if (!getInitialData) return;

  const { cards } = JSON.parse(getInitialData);

  cards.forEach((blogObject) => {
    const createNewBlog = newCard(blogObject);
    blogContainer.insertAdjacentHTML("beforeend", createNewBlog);
    globalStore.push(blogObject);
  });
};

const updateLocalStorage = () => {
  localStorage.setItem(
    "blog",
    JSON.stringify({
      cards: globalStore,
    })
  );
};

const saveChanges = () => {
  const blogData = {
    id: `${Date.now()}`,
    imageUrl: document.getElementById("imageurl").value,
    blogTitle: document.getElementById("title").value,
    blogType: document.getElementById("type").value,
    blogDescription: document.getElementById("description").value,
  };

  const createNewBlog = newCard(blogData);
  blogContainer.insertAdjacentHTML("beforeend", createNewBlog);

  globalStore.push(blogData);

  updateLocalStorage();
};

const deleteCard = (event) => {
  event = window.event;
  const targetID = event.target.id;

  globalStore = globalStore.filter((blogObject) => blogObject.id !== targetID);

  updateLocalStorage();

  const button =
    event.target.tagName === "BUTTON" ? event.target : event.target.parentNode;
  blogContainer.removeChild(button.closest(".col-lg-4"));
};

const editCard = (event) => {
  event = window.event;
  const targetID = event.target.id;

  const parentElement = event.target.closest(".col-lg-4");

  const blogTitle = parentElement.querySelector(".card-title");
  const blogDescription = parentElement.querySelector(".card-text");
  const blogType = parentElement.querySelector(".badge");
  const submitBtn = parentElement.querySelector(".btn-outline-primary");

  blogTitle.contentEditable = "true";
  blogDescription.contentEditable = "true";
  blogType.contentEditable = "true";
  submitBtn.setAttribute("onclick", "saveEditChanges.apply(this, arguments)");
  submitBtn.textContent = "Save Changes";

  submitBtn.removeAttribute("data-bs-toggle");
  submitBtn.removeAttribute("data-bs-target");
};

const saveEditChanges = (event) => {
  event = window.event;
  const targetID = event.target.id;

  const parentElement = event.target.closest(".col-lg-4");

  const blogTitle = parentElement.querySelector(".card-title");
  const blogDescription = parentElement.querySelector(".card-text");
  const blogType = parentElement.querySelector(".badge");
  const submitBtn = parentElement.querySelector(".btn-outline-primary");

  const updatedData = {
    blogTitle: blogTitle.textContent,
    blogDescription: blogDescription.textContent,
    blogType: blogType.textContent,
  };

  globalStore = globalStore.map((blog) => {
    if (blog.id === targetID) {
      return {
        id: blog.id,
        imageUrl: blog.imageUrl,
        blogTitle: updatedData.blogTitle,
        blogType: updatedData.blogType,
        blogDescription: updatedData.blogDescription,
      };
    }
    return blog;
  });

  updateLocalStorage();

  blogTitle.contentEditable = "false";
  blogDescription.contentEditable = "false";
  blogType.contentEditable = "false";

  submitBtn.setAttribute("onclick", "openBlog.apply(this, arguments)");
  submitBtn.setAttribute("data-bs-toggle", "modal");
  submitBtn.setAttribute("data-bs-target", "#showblog");
  submitBtn.textContent = "Open Blog";
};

const htmlModalContent = ({
  id,
  blogTitle,
  blogDescription,
  imageUrl,
  blogType,
}) => {
  const date = new Date(parseInt(id));
  return ` <div id=${id}>
   <img
   src=${imageUrl}
   alt="bg image"
   class="img-fluid place__holder__image mb-3 p-4"
   />
   <div class="text-sm text-muted ">Created on ${date.toDateString()}</div>
   <h2 class="my-5 mt-5" style="display:inline;">${blogTitle}</h2>
   <span class="badge bg-primary">${blogType}</span>
   <p class="lead mt-2">
   ${blogDescription}
   </p></div>`;
};

const openBlog = (event) => {
  event = window.event;
  const targetID = event.target.id;

  const getBlog = globalStore.filter(({ id }) => id === targetID);

  blogModal.innerHTML = htmlModalContent(getBlog[0]);
};

// Load data when the page is loaded
document.addEventListener("DOMContentLoaded", loadData);
