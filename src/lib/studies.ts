import data from "@/data/studies.json"

export type Study = {
  id: string;
  title: string;
  field: string;
  year: number;
  url: string;
  description: string;
};

export const studies = data as Study[];
export const total = studies.length;

export function groupByYear(list: Study[] = studies) {
  const map = new Map<number, Study[]>();
  for (const item of list) {
    const bucket = map.get(item.year) ?? [];
    bucket.push(item);
    map.set(item.year, bucket);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}

export function getStudy(id: string) {
  return studies.find((item) => item.id === id);
}

export function getNeighbors(id: string) {
  const index = studies.findIndex((item) => item.id === id);
  return {
    prev: index > 0 ? studies[index - 1] : undefined,
    next: index >= 0 && index < studies.length - 1 ? studies[index + 1] : undefined,
  };
}

export function padId(id: string) {
  return id;
}
