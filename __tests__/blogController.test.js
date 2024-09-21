const { validationResult } = require("express-validator");
const blogModel = require("../models/blogModel");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

// Mock external dependencies
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));
jest.mock("bcrypt");
jest.mock("../models/blogModel");
jest.mock("jsonwebtoken");
jest.mock("../middlewares/handleError");

describe("blog creation", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  //create blog ---- success
  test("blog created successfully", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    blogModel.mockImplementation((data) => ({
      save: jest.fn().mockResolvedValue({
        _id: "123",
        ...data,
      }),
    }));

    const req = {
      body: {
        title: "title",
        content: "content",
        tags: ["node", "react"],
      },
    };

    const response = await createBlog(req, res);
    expect(response).toEqual({
      message: "Blog created successfully",
      data: {
        _id: "123",
        title: "title",
        content: "content",
        tags: ["node", "react"],
      },
    });
  });

  test("validation error (tite/content is empty)", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => false,
      errors: [
        {
          msg: { message: "Tite is required" },
        },
      ],
    });

    //pass request with title field as empty
    const req = {
      body: {
        title: "",
        content: "content",
        tags: ["node", "react"],
      },
    };

    const response = await createBlog(req, res);
    expect(response).toEqual({
      code: 400,
      message: { message: "Tite is required" },
    });
  });
});

describe("get all blogs", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  //get all blogs ---- success
  test("get all blogs with pagination", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    const req = {
      query: {
        page: 1,
        limit: 10,
      },
    };

    const blogList = {
      docs: [
        {
          _id: "66ed69dc9d44da07c54dfc43",
          title: "title1",
          content: "new content1",
          author: {
            _id: "66ed179428faae45dc435f71",
            username: "anju2",
            email: "anju@gmail.comm",
            name: "Anjali",
            createdAt: "2024-09-20T06:35:00.904Z",
            updatedAt: "2024-09-20T06:35:00.904Z",
          },
          tags: ["nodejs"],
          comments: [],
          createdAt: "2024-09-20T12:26:04.938Z",
          updatedAt: "2024-09-20T12:26:04.938Z",
        },
        {
          _id: "66ed69d69d44da07c54dfc41",
          title: "title1",
          content: "new content1",
          author: {
            _id: "66ed179428faae45dc435f71",
            username: "anju2",
            email: "anju@gmail.comm",
            name: "Anjali",
            createdAt: "2024-09-20T06:35:00.904Z",
            updatedAt: "2024-09-20T06:35:00.904Z",
          },
          tags: ["nodejs"],
          comments: [],
          createdAt: "2024-09-20T12:25:58.153Z",
          updatedAt: "2024-09-20T12:25:58.153Z",
        },
        {
          _id: "66ed5812302875d555fd0615",
          title: "title1",
          content: "new content1",
          author: {
            _id: "66ed179428faae45dc435f71",
            username: "anju2",
            email: "anju@gmail.comm",
            name: "Anjali",
            createdAt: "2024-09-20T06:35:00.904Z",
            updatedAt: "2024-09-20T06:35:00.904Z",
          },
          tags: ["nodejs"],
          comments: [],
          createdAt: "2024-09-20T11:10:10.700Z",
          updatedAt: "2024-09-20T11:45:26.192Z",
        },
      ],
      totalDocs: 3,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };
    blogModel.paginate.mockResolvedValueOnce(blogList);

    const response = await getAllBlogs(req, res);
    expect(response).toEqual({
      message: "List of blogs",
      data: blogList,
    });
  });

  test("validation error (page/limit is not integer)", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => false,
      errors: [
        {
          msg: { message: "Page should be a positive integer" },
        },
      ],
    });

    //pass request with page field with non numeric value
    const req = {
      query: {
        page: "m",
        limit: 10,
      },
    };

    const response = await getAllBlogs(req, res);
    expect(response).toEqual({
      code: 400,
      message: { message: "Page should be a positive integer" },
    });
  });
});

describe("get blog by id", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  //get deatils of blog by its id ---- success
  test("get details of a blog - success", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    const req = {
      params: {
        id: "66ed4c9c1785f32edbe86d29",
      },
    };

    const blogDetail = {
      _id: "66ed4c9c1785f32edbe86d29",
      title: "updated title",
      content: "updated content",
      author: {
        _id: "66ed179428faae45dc435f71",
        username: "anju2",
        email: "anju@gmail.comm",
        name: "Anjali",
        createdAt: "2024-09-20T06:35:00.904Z",
        updatedAt: "2024-09-20T06:35:00.904Z",
      },
      tags: ["nodejs", "tech"],
      comments: ["66ed4ca71785f32edbe86d2c"],
      createdAt: "2024-09-20T10:21:16.941Z",
      updatedAt: "2024-09-20T11:39:42.463Z",
    };

    blogModel.findById.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(blogDetail),
    });

    const response = await getBlogById(req, res);
    expect(response).toEqual({
      message: "Blog details",
      data: blogDetail,
    });
  });

  test("get details of a blog - blog not found", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    const req = {
      params: {
        id: 1,
      },
    };

    blogModel.findById.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(null),
    });

    const response = await getBlogById(req, res);
    expect(response).toEqual({ code: 400, message: "Blog not found" });
  });
});

describe("update blog by its id", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  // test("validation error (tite/content is empty)", async () => {
  //     validationResult.mockReturnValueOnce({
  //         isEmpty: () => false,
  //         errors: [
  //           {
  //             msg: { message: "Tite is required" },
  //           },
  //         ],
  //       });

  //     //pass request with title field as empty
  //     const req = {
  //         body: {
  //           title: "",
  //           content: "content",
  //           tags: ["node", "react"],
  //         },
  //       };

  //     const response1 = await updateBlog(req, res);
  //     expect(response1).toEqual({
  //       code: 400,
  //       message: { message: "Tite is required" },
  //     });
  // });

  test("update blog by its id - blog not found", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    const req2 = {
      params: {
        id: 1,
      },
    };

    blogModel.findById.mockReturnValueOnce(null);

    const response2 = await updateBlog(req2, res);
    expect(response2).toEqual({ code: 400, message: "Blog not found" });
  });

  // update blog by its id ---- success
  test("update blog by its id - success", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    const req3 = {
      params: { id: "66ed4c9c1785f32edbe86d29" },
      body: {
        title: "updated title",
        content: "updated content",
        tags: ["tech"],
      },
      user: "66ed179428faae45dc435f71",
    };

    const blogDetail = {
      _id: "66ed4c9c1785f32edbe86d29",
      title: "title",
      content: "content",
      author: "66ed179428faae45dc435f71",
      tags: ["nodejs", "tech"],
      comments: [],
      createdAt: "2024-09-20T10:21:16.941Z",
      updatedAt: "2024-09-20T11:39:42.463Z",
    };

    const updatedBlog = {
      _id: "66ed4c9c1785f32edbe86d29",
      title: "updated title",
      content: "updated content",
      author: "66ed179428faae45dc435f71",
      tags: ["tech"],
      comments: [],
      createdAt: "2024-09-20T10:21:16.941Z",
      updatedAt: "2024-09-20T11:39:42.463Z",
    };

    blogModel.findById.mockReturnValueOnce(blogDetail);
    blogModel.findByIdAndUpdate.mockResolvedValueOnce(updatedBlog);

    const response3 = await updateBlog(req3, res);

    expect(response3).toEqual({
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  });

  test("update blog by its id - access denied", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    const req4 = {
      params: { id: "66ed4c9c1785f32edbe86d29" },
      body: {
        title: "updated title",
        content: "updated content",
        tags: ["tech"],
      },
      user: "66ed179428faae45dc435f71",
    };

    const blogDetail = {
      _id: "66ed4c9c1785f32edbe86d29",
      title: "title",
      content: "content",
      author: "66ed4c9c1785f32edbe86d29",
      tags: ["nodejs", "tech"],
      comments: [],
      createdAt: "2024-09-20T10:21:16.941Z",
      updatedAt: "2024-09-20T11:39:42.463Z",
    };

    blogModel.findById.mockReturnValueOnce(blogDetail);

    const response4 = await updateBlog(req4, res);
    expect(response4).toEqual({
      code: 403,
      message: "Access Denied! Cannot update this blog",
    });
  });
});


//delete blog
describe("delete blog by its id", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  test("delete blog by its id - blog not found", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    const req2 = {
      params: {
        id: 1,
      },
    };

    blogModel.findById.mockReturnValueOnce(null);

    const response2 = await deleteBlog(req2, res);
    expect(response2).toEqual({ code: 400, message: "Blog not found" });
  });

  // update blog by its id ---- success
//   test("delete blog by its id - success", async () => {
//     validationResult.mockReturnValueOnce({
//       isEmpty: () => true,
//     });

//     const req3 = {
//       params: { id: "66ed4c9c1785f32edbe86d29" },
//       user: "66ed179428faae45dc435f71"
//   };

//     const blogDetail = {
//       _id: "66ed4c9c1785f32edbe86d29",
//       title: "title",
//       content: "content",
//       author: "66ed179428faae45dc435f71",
//       tags: ["nodejs", "tech"],
//       comments: [],
//       createdAt: "2024-09-20T10:21:16.941Z",
//       updatedAt: "2024-09-20T11:39:42.463Z",
//     };

//     blogModel.findById.mockReturnValueOnce(blogDetail);
//     blogModel.findByIdAndDelete.mockResolvedValueOnce(blogDetail);
//     commentsModel.deleteMany.mockResolvedValueOnce()

//     const response3 = await deleteBlog(req3, res);
//     console.log(response3,"responseresponseresponse");

//     expect(response3).toEqual({ message : "Blog deleted successfully" });
    
//   });

  test("delete blog by its id - access denied", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    const req4 = {
      params: { id: "66ed4c9c1785f32edbe86d29" },
      user: "66ed179428faae45dc435f71",
    };

    const blogDetail = {
      _id: "66ed4c9c1785f32edbe86d29",
      title: "title",
      content: "content",
      author: "66ed4c9c1785f32edbe86d29",
      tags: ["nodejs", "tech"],
      comments: [],
      createdAt: "2024-09-20T10:21:16.941Z",
      updatedAt: "2024-09-20T11:39:42.463Z",
    };

    blogModel.findById.mockReturnValueOnce(blogDetail);

    const response4 = await deleteBlog(req4, res);
    expect(response4).toEqual({
      code: 403,
      message: "Access Denied! Cannot delete this blog",
    });
  });
});
