export const encodePageData = (data) => {
  return window.btoa(encodeURIComponent(JSON.stringify(data)));
};

export const decodePageData = (msg) => {
  return JSON.parse(decodeURIComponent(window.atob(msg)));
};

export const deleteSearchParams = () => {
  const url = new URL(window.location);
  url.searchParams.delete("pageData");
  url.searchParams.delete("ppi");
  url.searchParams.delete("ps");
  window.history.pushState(null, "", url.toString());
};
