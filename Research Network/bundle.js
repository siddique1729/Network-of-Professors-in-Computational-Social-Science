(function (d3) {
    'use strict';
  
    // Generated with https://paletton.com/#uid=75x0u0kigkU8ZuBdTpdmbh6rjc7
    const colors = [
      ['#9D4452', '#E6A6B0', '#BE6B78', '#812836', '#5B0D1A'],
      ['#A76C48', '#F4CAAF', '#C99372', '#884E2A', '#602E0E'],
      ['#2E6B5E', '#719D93', '#498175', '#1B584A', '#093E32'],
      ['#538E3D', '#A6D096', '#75AC61', '#3A7424', '#1F520C'],
    ];
  
    const nodes = [];
    const links = [];
  
    const MAIN_NODE_SIZE = 40;
    const CHILD_NODE_SIZE = 15;
    const LEAF_NODE_SIZE = 5;
    const DEFAULT_DISTANCE = 20;
    const MAIN_NODE_DISTANCE = 90;
    const LEAF_NODE_DISTANCE = 30;
    const MANY_BODY_STRENGTH = -20;
     
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
    assembleChildNode(artsWeb, 'Albert-Laszla Barabasi');
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
    assembleChildNode(cast, 'Johan Bollen', 5);
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
  
    const svg = d3.select('#container');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const centerX = width / 2;
    const centerY = height / 2;
  
    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(MANY_BODY_STRENGTH))
      .force(
        'link',
        d3.forceLink(links).distance((link) => link.distance)
      )
      .force('center', d3.forceCenter(centerX, centerY));
  
    const dragInteraction = d3.drag().on('drag', (event, node) => {
      node.fx = event.x;
      node.fy = event.y;
      simulation.alpha(1);
      simulation.restart();
    });
  
  
    const lines = svg
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (link) => link.color || 'black');
  
  
    const circles = svg
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('fill', (node) => node.color || 'gray')
      .attr('r', (node) => node.size)
      .call(dragInteraction);
  
    const text = svg
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('pointer-events', 'none')
      .text((node) => node.id);
  
    simulation.on('tick', () => {
      circles.attr('cx', (node) => node.x).attr('cy', (node) => node.y);
      text.attr('x', (node) => node.x).attr('y', (node) => node.y);
  
      lines
        .attr('x1', (link) => link.source.x)
        .attr('y1', (link) => link.source.y)
        .attr('x2', (link) => link.target.x)
        .attr('y2', (link) => link.target.y);
    });
  
  }(d3));