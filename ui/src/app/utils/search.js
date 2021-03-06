import { WORKLOAD_FILTER_PREFIX } from "app/machines/search";

// Helpers that convert the pseudo field on node to an actual
// value from the node.
const searchMappings = {
  cpu: (node) => node.cpu_count,
  cores: (node) => node.cpu_count,
  ram: (node) => node.memory,
  mac: (node) => [node.pxe_mac, ...node.extra_macs],
  zone: (node) => node.zone.name,
  pool: (node) => node.pool.name,
  pod: (node) => node.pod && node.pod.name,
  "pod-id": (node) => node.pod && node.pod.id,
  power: (node) => node.power_state,
  release: (node) =>
    node.status_code === 6 || node.status_code === 9
      ? node.osystem + "/" + node.distro_series
      : "",
  hostname: (node) => node.hostname,
  ip_addresses: (node) => node.ip_addresses.map(({ ip }) => ip),
  vlan: (node) => node.vlan,
  rack: (node) => node.observer_hostname,
  subnet: (node) => node.subnet_cidr,
  numa_nodes_count: ({ numa_nodes_count, numa_nodes }) => {
    const count = numa_nodes_count || (numa_nodes && numa_nodes.length);
    return `${count} node${count !== 1 ? "s" : ""}`;
  },
  sriov_support: ({ sriov_support, interfaces }) =>
    sriov_support ||
    (interfaces && interfaces.some((iface) => iface.sriov_max_vf >= 1))
      ? "Supported"
      : "Not supported",
  workload_annotations: (node) => {
    if (Boolean(node.workload_annotations)) {
      return Object.keys(node.workload_annotations);
    }
    return null;
  },
};

export const getMachineValue = (machine, filter) => {
  const mapFunc = searchMappings[filter];
  let value;
  if (
    filter.startsWith(WORKLOAD_FILTER_PREFIX) &&
    Boolean(machine.workload_annotations)
  ) {
    // Workload annotation filters are treated differently, as filtering is done
    // based on arbitrary object keys rather than simple, defined machine values.
    const [, ...splitWorkload] = filter.split(WORKLOAD_FILTER_PREFIX);
    const workloadKey = splitWorkload.join("");
    value = machine.workload_annotations[workloadKey];
  } else if (typeof mapFunc === "function") {
    value = mapFunc(machine);
  } else if (machine.hasOwnProperty(filter)) {
    value = machine[filter];
  }
  return value;
};
