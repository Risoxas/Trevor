interface SampleDateRecord {
  _id: string;
  index: number;
  guid: string;
  isActive: boolean;
  balance: number | string;
  picture: string | null;
  age: number;
  eyeColor: string;
  name: string;
  gender: string;
  company: string;
  email: string | null;
  phone: string;
  address: string;
  about: string;
  registered: string;
  latitude: number;
  longitude: number;
  tags: string[];
  friends: Friend[];
}

interface Friend {
  id: number;
  name: string;
}

interface TagCounts {
  tag: string;
  count: number;
}
