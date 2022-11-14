import axios from "axios";

export async function getSparePart(
  pageSize = 10,
  pageIndex = 1,
  keyword = null
) {
  return axios.get("/product/get-pagination", {
    params: {
      pageSize,
      pageIndex,
      keyword,
    },
  });
}

export const deleteSparePart = (productId) => {
  return axios.delete("/product/delete", {
    params: { id: productId },
  });
};

export const createNewSparePart = (sparePart) => {
  return axios.post("/product/add", sparePart);
};

export const updateSparePart = (sparePart) => {
  return axios.put("/product/edit", sparePart);
};
