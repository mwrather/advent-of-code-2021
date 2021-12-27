import getInput from '../../../utils/getInput';

type Graph = Record<string, Array<string>>;
type Route = Array<string>;
type RouteList = Array<Route>;

const data = getInput('2021', '12')
  .trim()
  .split('\n')
  .reduce<Graph>((acc, graphString: string) => {
    const [from, to] = graphString.split('-') as [string, string];
    acc[from] = acc[from] || [];
    acc[to] = acc[to] || [];
    acc[from].push(to);
    acc[to].push(from);
    return acc;
  }, {});

const routeFinished = (route: Route): boolean =>
  route[route.length - 1] === 'end';
const allFinished = (routes: RouteList): boolean => routes.every(routeFinished);
const noSmallCavesTwice = (route: Route): boolean => {
  const visited: Record<string, boolean> = {};
  const smallCaves = route.filter((node) => node.toLowerCase() === node);
  for (const cave of smallCaves) {
    if (visited[cave]) return false;
    visited[cave] = true;
  }
  return true;
};
const oneCaveTwice = (route: Route): boolean => {
  const visited: Record<string, number> = {};
  const smallCaves = route.filter((node) => node.toLowerCase() === node);
  for (const cave of smallCaves) {
    visited[cave] = (visited[cave] || 0) + 1;
  }
  return (
    visited.start === 1 &&
    !Object.values(visited).some((count) => count > 2) &&
    Object.values(visited).filter((n) => n > 1).length <= 1
  );
};

const calculateRoutes = (map: Graph, filterFn: (r: Route) => boolean) =>
  function nextStep(routes: RouteList): RouteList {
    return allFinished(routes)
      ? routes
      : nextStep(
          routes.flatMap<Route, RouteList>((route) => {
            if (routeFinished(route)) return [route];
            return map[route[route.length - 1]]
              .map((next) => [...route, next])
              .filter(filterFn);
          })
        );
  };

function part1(map: Graph) {
  return calculateRoutes(map, noSmallCavesTwice)([['start']]).length;
}
function part2(map: Graph) {
  return calculateRoutes(map, oneCaveTwice)([['start']]).length;
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
