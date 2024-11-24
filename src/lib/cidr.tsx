export const isValidSubnet = (subnet: string): boolean => {
  const regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(subnet);
};

export const ipToInt = (ip: string): number => {
  return ip
    .split(".")
    .map((octet) => parseInt(octet, 10))
    .reduce((acc, curr) => (acc << 8) | curr, 0);
};

export const intToIp = (ipInt: number): string => {
  return [
    (ipInt >>> 24) & 0xff,
    (ipInt >>> 16) & 0xff,
    (ipInt >>> 8) & 0xff,
    ipInt & 0xff,
  ].join(".");
};

export const calculateCidrOptions = (subnet: string): { cidr: number; info: string }[] => {
  if (!isValidSubnet(subnet)) {
    return [];
  }

  const subnetInt = ipToInt(subnet);
  const maxPrefix = 32; // Most specific prefix
  const minPrefix = 8;  // Least specific prefix (e.g., /8)
  const options: { cidr: number; info: string }[] = [];

  for (let prefix = minPrefix; prefix <= maxPrefix; prefix++) {
    const blockSize = 2 ** (32 - prefix); // Block size for this prefix
    const alignedSubnet = Math.floor(subnetInt / blockSize) * blockSize; // Align to block start

    if (alignedSubnet === subnetInt) {
      const totalAddresses = blockSize;
      const usableAddresses =
        prefix === 31 || prefix === 32 ? totalAddresses : totalAddresses - 2; // Account for reserved IPs
      const startAddress = intToIp(alignedSubnet);
      const endAddress = intToIp(alignedSubnet + blockSize - 1);

      options.push({
        cidr: prefix,
        info: `/${prefix}`,
      });
    }
  }

  return options;
};
