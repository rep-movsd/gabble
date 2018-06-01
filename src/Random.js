export class Random
{
  // If seed is ommitted use timestamp
  constructor(i)
  {
    this.seed(i || (new Date()) .getTime());
  }

  seed(i)
  {
    this.m_w = i;
    this.m_z = 987654321;
  }

  // Returns number between 0  and n-1,
  get(n)
  {
    this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & 0xffffffff;
    this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & 0xffffffff;
    let result = ((this.m_z << 16) + this.m_w) & 0xffffffff;
    return result % n;
  }

}




