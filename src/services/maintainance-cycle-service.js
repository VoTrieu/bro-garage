import axios from "axios";

export async function getMaintainanceCycle(
  pageSize = 10,
  pageIndex = 1,
  keyword = null
) {
  return axios.get("/template/get-pagination", {
    params: {
      pageSize,
      pageIndex,
      keyword,
    },
  });
}

export const deleteMaintainanceCycle = (maintainanceCycleId) => {
  return axios.delete("/template/delete", {
    params: { id: maintainanceCycleId },
  });
};

export const createMaintainanceCycle = (maintainanceCycle) => {
  return axios.post("/template/add", maintainanceCycle);
};

export const updateMaintainanceCycle = (maintainanceCycle) => {
  return axios.put("/template/edit", maintainanceCycle);
};
