interface DockerPort {
  IP: string;
  PrivatePort: number;
  PublicPort: number;
  Type: string;
}

interface DockerLabels {
  [key: string]: string;
}

interface DockerNetworkSettings {
  IPAMConfig: null | any;
  Links: null | string[];
  Aliases: null | string[];
  MacAddress: string;
  DriverOpts: null | any;
  NetworkID: string;
  EndpointID: string;
  Gateway: string;
  IPAddress: string;
  IPPrefixLen: number;
  IPv6Gateway: string;
  GlobalIPv6Address: string;
  GlobalIPv6PrefixLen: number;
  DNSNames: null | string[];
}

interface DockerNetworks {
  [networkName: string]: DockerNetworkSettings;
}

interface DockerContainer {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
  Ports: DockerPort[];
  Labels: DockerLabels;
  State: string;
  Status: string;
  HostConfig: {
    NetworkMode: string;
  };
  NetworkSettings: {
    Networks: DockerNetworks;
  };
}