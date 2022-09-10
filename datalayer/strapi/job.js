import axios from "./client";
import qs from "qs";
import { dateReducer, skillsReducer, jobReducer } from "./utils";

const apiUrl = process.env.STRAPI_API_BASE_URL;
const populateFields = [
  "company",
  "company.logo",
  "company.coverImage",
  "relatedJobs",
  "relatedJobs.company",
  "relatedJobs.company.logo",
  "relatedJobs.company.coverImage",
  "skillsTags",
];

export const getJobBySlug = async ({ slug }) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: populateFields,
    },
    {
      encodeValuesOnly: true,
    }
  );
  const res = await axios.get(`${apiUrl}/jobs?${query}`);
  const rawJob = res.data.data[0];
  return jobReducer(rawJob);
};

export const getJobs = async ({ page = 0, pageSize = 100 } = {}) => {
  const query = qs.stringify(
    {
      populate: populateFields,
      pagination: {
        page,
        pageSize,
      },
    },
    { encodeValuesOnly: true }
  );
  const res = await axios.get(`${apiUrl}/jobs?${query}`);
  const rawJobs = res.data.data;
  const jobs = rawJobs.map((rawJob) => jobReducer(rawJob, false)); // set to false because don't need the relatedJobs where this is used (job listings)
  return jobs;
};

export const getJobsByCompanyId = async ({ id }) => {
  const query = qs.stringify(
    {
      filters: {
        company: {
          id: {
            $eq: id,
          },
        },
      },
      populate: populateFields,
    },
    {
      encodeValuesOnly: true,
    }
  );
  const res = await axios.get(`${apiUrl}/jobs?${query}`);
  const rawJobs = res.data.data;
  const jobs = rawJobs.map((rawJob) => jobReducer(rawJob, false)); // set to false because don't need the relatedJobs where this is used (job listings)
  return jobs;
};

export const searchJobs = async (query) => {
  const strapiQuery = {
    populate: populateFields,
    filters: {},
  };

  // Boolean Query Filters (RemoteOk, FeaturedJob)
  if (query.remoteOk) strapiQuery["filters"]["remoteOk"] = { $eq: true };
  if (query.featuredJobsOnly)
    strapiQuery["filters"]["featuredJob"] = { $eq: true };

  // Range Query Filters (Salary Range)
  strapiQuery["filters"]["baseAnnualSalary"] = {
    $gte: query.minBaseSalary,
    $lte: query.maxBaseSalary,
  };

  //  Inclusion Query Filters (Checkboxes for Job Type)
  if (query.jobTypes && query.jobTypes.length)
    strapiQuery["filters"]["jobType"] = { $in: query.jobTypes };
  if (query.experienceLevels && query.experienceLevels.length)
    strapiQuery["filters"]["experienceLevel"] = {
      $in: query.experienceLevels,
    };

  // Nested Inclusion Query Filters (Checkboxes for Skills) - because skillsTags has a relation with the Tag collection
  if (query.selectedTags && query.selectedTags.length)
    strapiQuery["filters"]["skillsTags"] = {
      name: {
        $in: query.selectedTags,
      },
    };

  // Add Full Text Search
  if (query.searchBarText) {
    const searchFields = [
      "title",
      "jobCategory",
      "jobType",
      "jobDescription",
      "aboutYou",
      "jobResponsibilities",
      "remunerationPackage",
      // deep nested search fields
      "skillsTags.name",
      "company.name",
      "company.city",
    ];
    strapiQuery["filters"]["$or"] = searchFields.map((field) => {
      const searchField = {};
      if (!field.includes(".")) {
        searchField[field] = { $containsi: query.searchBarText };
      } else {
        const [level1, level2] = field.split(".");
        const nestedSearchField = {};
        nestedSearchField[level2] = { $containsi: query.searchBarText };
        searchField[level1] = nestedSearchField;
      }
      return searchField;
    });
  }

  const strapiQueryStr = qs.stringify(strapiQuery, { encodeValuesOnly: true });
  const res = await axios.get(`${apiUrl}/jobs?${strapiQueryStr}`);
  const rawJobs = res.data.data;
  const jobs = rawJobs.map((rawJob) => jobReducer(rawJob, false)); // set to false because don't need the relatedJobs where this is used (job listings)
  return jobs;
};

export const getJobsSkills = async () => {
  const query = qs.stringify(
    {
      fields: ["name"],
      filters: {
        type: {
          $eq: "skill",
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
  const res = await axios.get(`${apiUrl}/tags?${query}`);
  const rawTags = res.data.data;
  const tags = rawTags.map((rawTag) => rawTag.attributes.name);
  return tags;
};

export const getJobsSlugs = async () => {
  const query = qs.stringify(
    {
      fields: ["slug"],
    },
    {
      encodeValuesOnly: true,
    }
  );
  const res = await axios.get(`${apiUrl}/jobs?${query}`);
  const rawSlugs = res.data.data;
  const slugs = rawSlugs.map((rawSlug) => rawSlug.attributes.slug);
  return slugs;
};
