// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import datasource from "../../datalayer";

export default async function handler(req, res) {
  //   const data = await datasource.getCompanies();
  //   const data = await datasource.getCompanyBySlug({ slug: "aviva" });
  //   const data = await datasource.getJobBySlug({
  //     slug: "forward-deployed-software-engineer-new-grad",
  //   });
  //   const data = await datasource.getJobsByCompanyId({
  //     id: 1,
  //   });
  //   const data = await datasource.getJobs({ page: 1, pageSize: 3 });
  //   const data = await datasource.searchJobs({
  //     featuredJobsOnly: true,
  //     remoteOk: true,
  //   });
  //   const data = await datasource.searchJobs({
  //     minBaseSalary: 70000,
  //     maxBaseSalary: 120000,
  //   });
  //   const data = await datasource.searchJobs({
  //     jobTypes: ["Full-time", "Internship"],
  //   });
  //   const data = await datasource.searchJobs({
  //     selectedTags: ["NextJs", "TailwindCSS", "Docker"],
  //   });
  //   const data = await datasource.searchJobs({
  //     searchBarText: ["docker"],
  //   });
  //   const data = await datasource.getJobsSkills();

  res.status(200).json(data);
}
