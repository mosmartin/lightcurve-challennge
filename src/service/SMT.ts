interface DB {
  get: (key: Buffer) => Promise<Buffer>;
  set: (key: Buffer, value: Buffer) => Promise<void>;
  del: (key: Buffer) => Promise<void>;
}

export class SMT {
  constructor(private root: Buffer, private db: DB) {}

  async update(key: Buffer, value: Buffer): Promise<void> {
    let ancestorNodes = null;
    let currentNode = this.root;
    let binaryKey = binaryExpansion(key);

    for (let h = 0; h < binaryKey.length; h++) {
      ancestorNodes = await this.db.get(currentNode);
      let d = binaryKey[h];

      if (d === 0) {
        currentNode = ancestorNodes.child1;
      } else if (d === 1) {
        currentNode = ancestorNodes.child2;
      }

      if (currentNode === null) {
        currentNode = await this.db.get(getEmptyNode(h));
      }
    }

    let bottomNode = leafNode(key, value);
    for (let h = 0; h < binaryKey.length; h++) {
      let d = binaryKey[h - 1];
      let ancestor = ancestorNodes[h - 1];

      if (d === 0) {
        ancestorNodes.child1 = bottomNode;
      } else if (d === 1) {
        ancestorNodes.child2 = bottomNode;
      }

      await this.db.set(ancestorNodes.hash, ancestorNodes);
    }

    return bottomNode.hash;
  }
}
