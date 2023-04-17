---
title_tag: "Pulumi Insights"
title: "Pulumi Insights"
meta_desc: Pulumi Insights provides advanced search, analytics, and AI for your infrastructure as code.
menu:
  intro:
    identifier: insights
    weight: 6

aliases: ["/docs/intro/insights/"]
---

Pulumi Insights provides advanced search, analytics, and AI for your infrastructure as code.

It provides:

- **Resource Search** - Explore all of your resources under management.
  Filter resources by stack, project, or a number of other dimensions.

- **Resource Search Aggregates** - See aggregates at a glance for your resources under management.
  Start with a birds-eye view of your infrastructure, and leverage search to dig deeper.

- **Cloud Import** - Bring your own cloud provider account and import all of your existing resources into Pulumi to see how things break down. Zero code required.

- **Data Export** - Export your Pulumi resources into your business intelligence tool of choice to go even further.

- **Resource Search AI Assist** (experimental) - Use natural language processing to help craft search queries to explore your data.

## Resource Search

Resource Search can be accessed directly from the Pulumi Cloud dashboard or from the side navigation by navigating to the 'Resources' tab.

By default, you will see a table with the resources you have access to, ordered by most recently updated.

A count is shown the upper-right corner with the total number of resources matched by this query -- in this case, we have 70 resources.

![Resource Search Table](search-table.png)

You can control how many resources are displayed per page and paginate through your resources by using controls on the bottom of the page:

![Resource Search Pagination](search-pagination.png)

{{% notes "info" %}}
The web UI does not allow paginating through more than several thousand resources at a time.

If you need access to more resources, you can use the [Data Export](export) feature or access them programmatically via the [API](/docs/reference/cloud-rest-api#resource-search).
{{% /notes %}}

You can use the search bar to refine the resources displayed on the page.

Clicking "project" will pre-populate a query with `project:` which we can then extend to `project:production` to return resources with "production" in their project name.

Clicking on the "Filter" menu to the left of the search bar can augment or pre-populate queries with helpful date ranges.

![Resource Search Filters](search-filters.png)

The columns displayed on results can be modified to show or hide information by clicking on the gear icon in the upper left corder.

![Resource Search Columns](search-columns.png)

Clicking on a column header will modify the query to sort by that column.

### Resource Search Aggregates

The "Advanced filtering" menu can be expanded to apply additional filters to your query and to see finer-grained resource counts.

![Resource Search Advanced Filters](search-advanced.png)

In the example above, the query has been restricted to the "my-stack" stack.

The counts next to each value show that this stack has 18 subnets, and 366 AWS resources in total.

Clicking "Clear filters" will remove all previously selected filters.

## Data Export

{{% notes "info" %}}
This feature is only available to organizations using the Enterprise and Business Critical editions.
If you don't see it in your organization, [contact sales](/contact?form=sales).
{{% /notes %}}

Organizations with Data Export enabled are able to export all resources matching a particular query in CSV format.

For a more detailed description of CSV schema, see the [documentation](export).

## APIs

See the [Pulumi Cloud REST API](/docs/reference/cloud-rest-api#resource-search) for full details of the API endpoint to query and export resources.