import axios from "axios";

export async function getRepairForms(
  pageSize = 10,
  pageIndex = 1,
  keyword = null,
  searchParameters = {}
) {
  return axios.get("/order/get-pagination", {
    params: {
      pageSize,
      pageIndex,
      keyword,
      ...searchParameters
    },
  });
}

export const getRepairFormsExport = (
  keyword = null,
  searchParameters = {}
) => {
  return axios.get("/order/export", {
    params: {
      keyword,
      ...searchParameters
    },
    responseType: "blob"
  });
}

export const deleteRepairForm = (repairFormId) => {
  return axios.delete("/order/delete", {
    params: { id: repairFormId },
  });
};

export const createRepairForm = (RepairForm) => {
  return axios.post("/order/add", RepairForm);
};

export const updateRepairForm = (RepairForm) => {
  return axios.put("/order/edit", RepairForm);
};

export const getRepairFormDetail = (RepairFormId) => {
  return axios.get("/order/get-by-id", {
    params: {
      id: RepairFormId,
    },
  });
};

export const getRepairStatus = () => {
  return axios.get("/order-status/get-all");
};

export const getRepairTypes = () => {
  return axios.get("/order-type/get-all");
};
