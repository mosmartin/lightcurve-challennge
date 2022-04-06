// TODO: get value of constant
const KEY_LENGTH_BYTES = 0;

// TODO: implement functionality
function hash(arg0: Buffer) {
  throw new Error('Function not implemented.');
}

function leafNode(key: Buffer, value: Buffer) {
  return {
    data: key || value,
    hash: hash(0x00 || data),
  };
}

function branchNode(child1: any, child2: any) {
  return {
    data: child1 || child2,
    hash: hash(0x01 || data),
  };
}

function binaryExpansion(k: Buffer): number[] {
  let result = [];
  
  for (let i = 0; i < k.length; i++) {
    result.push(k[i]);
  }

  return result;
}

function getEmptyNode(height: number) {
  if (height === 0) {
    return leafNode(null, null);
  }

  let data = getEmptyNode(height - 1)?.hash;
}
