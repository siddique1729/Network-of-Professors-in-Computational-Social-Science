import { colors } from './colors';

export const nodes = [];
export const links = [];

const MAIN_NODE_SIZE = 40;
const CHILD_NODE_SIZE = 15;
const LEAF_NODE_SIZE = 5;
const DEFAULT_DISTANCE = 20;
const MAIN_NODE_DISTANCE = 90;
const LEAF_NODE_DISTANCE = 30;
export const MANY_BODY_STRENGTH = -20;

let i = 0;

const addMainNode = (node) => {
  node.size = MAIN_NODE_SIZE;
  node.color = colors[i++][1];
  nodes.push(node);
};

const addChildNode = (
  parentNode,
  childNode,
  size = CHILD_NODE_SIZE,
  distance = DEFAULT_DISTANCE
) => {
  childNode.size = size;
  childNode.color = parentNode.color;
  nodes.push(childNode);
  links.push({
    source: parentNode,
    target: childNode,
    distance,
    color: parentNode.color,
  });
};

const assembleChildNode = (parentNode, id, numLeaves = 20) => {
  const childNode = { id };
  addChildNode(parentNode, childNode);

  for (let i = 0; i < numLeaves; i++) {
    addChildNode(childNode, { id: '' }, LEAF_NODE_SIZE, LEAF_NODE_DISTANCE);
  }
};

const connectMainNodes = (source, target) => {
  links.push({
    source,
    target,
    distance: MAIN_NODE_DISTANCE,
    color: source.color
  });
};

const artsWeb = { id: 'Northeastern' };
addMainNode(artsWeb);
assembleChildNode(artsWeb, 'Albert-Laszlo Barabasi');
assembleChildNode(artsWeb, 'David Lazer');
assembleChildNode(artsWeb, 'Alessandro Vespignani');

const socialImpactCommons = { id: 'MIT' };
addMainNode(socialImpactCommons);
assembleChildNode(socialImpactCommons, 'Alex Sandy Pentland');
assembleChildNode(socialImpactCommons, 'Andrew Lippman');
assembleChildNode(socialImpactCommons, 'Sinan Aral');

const cast = { id: 'Indiana' };
addMainNode(cast);
assembleChildNode(cast, 'Santo Fortunato');
assembleChildNode(cast, 'Filippo Menczer');
assembleChildNode(cast, 'Alessandro Flammini');
assembleChildNode(cast, 'Olaf Sporns');

const ambitioUS = { id: 'University of Pennsylvania' };
addMainNode(ambitioUS);
assembleChildNode(ambitioUS, 'Duncan J Watts');
assembleChildNode(ambitioUS, 'Michael Kearns');


connectMainNodes(artsWeb, socialImpactCommons);
connectMainNodes(artsWeb, cast);
connectMainNodes(socialImpactCommons, cast);
connectMainNodes(ambitioUS, cast);
connectMainNodes(ambitioUS, socialImpactCommons);
connectMainNodes(ambitioUS, artsWeb);
