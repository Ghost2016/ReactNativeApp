/* @flow */
import { createSelector } from "reselect";
import { getCompanyTableData } from "../directSelectors";

export const getSelectorCompanyTableData = createSelector(
  [getCompanyTableData],
  tableData => {
    return tableData.map((item, index) => {
      return {
        id: index,
        companyName: item.company_name,
        averageSalary: "¥" + item.avg_salary,
        percent: (parseFloat(item.ratio) * 100).toFixed(2) + "%"
      };
    });
  }
);
