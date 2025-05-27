import java.util.*;

class Station {
    String name;
    Set<String> lines;

    Station(String name) {
        this.name = name;
        this.lines = new HashSet<>();
    }

    void addLine(String line) {
        lines.add(line);
    }
}

class Edge {
    String targetStation;
    int time;

    Edge(String targetStation, int time) {
        this.targetStation = targetStation;
        this.time = time;
    }
}

class MetroMap {
    Map<String, Station> stations = new HashMap<>();
    Map<String, List<Edge>> graph = new HashMap<>();

    void addStation(String name, String line) {
        stations.putIfAbsent(name, new Station(name));
        stations.get(name).addLine(line);
        graph.putIfAbsent(name, new ArrayList<>());
    }

    void connectStations(String s1, String s2, int time) {
        graph.get(s1).add(new Edge(s2, time));
        graph.get(s2).add(new Edge(s1, time));
    }

    List<String> findFastestRoute(String source, String destination) {
        Map<String, Integer> dist = new HashMap<>();
        Map<String, String> prev = new HashMap<>();
        PriorityQueue<String> pq = new PriorityQueue<>(Comparator.comparingInt(dist::get));

        for (String station : graph.keySet()) {
            dist.put(station, Integer.MAX_VALUE);
        }

        dist.put(source, 0);
        pq.add(source);

        while (!pq.isEmpty()) {
            String current = pq.poll();

            for (Edge edge : graph.get(current)) {
                int newDist = dist.get(current) + edge.time;
                if (newDist < dist.get(edge.targetStation)) {
                    dist.put(edge.targetStation, newDist);
                    prev.put(edge.targetStation, current);
                    pq.add(edge.targetStation);
                }
            }
        }

        List<String> path = new ArrayList<>();
        String curr = destination;
        while (curr != null) {
            path.add(0, curr);
            curr = prev.get(curr);
        }

        return dist.get(destination) == Integer.MAX_VALUE ? null : path;
    }

    int getTotalTime(List<String> path) {
        int totalTime = 0;
        String currentLine = null;

        for (int i = 0; i < path.size() - 1; i++) {
            String from = path.get(i);
            String to = path.get(i + 1);
            int segmentTime = 0;

            for (Edge edge : graph.get(from)) {
                if (edge.targetStation.equals(to)) {
                    segmentTime = edge.time;
                    break;
                }
            }

            Set<String> linesFrom = stations.get(from).lines;
            Set<String> linesTo = stations.get(to).lines;

            String commonLine = null;
            for (String line : linesFrom) {
                if (linesTo.contains(line)) {
                    commonLine = line;
                    break;
                }
            }

            if (currentLine != null && !currentLine.equals(commonLine)) {
                totalTime += 5; // Interchange penalty
            }

            currentLine = commonLine;
            totalTime += segmentTime;
        }

        return totalTime;
    }

    void printRouteWithLineChanges(List<String> path) {
        if (path == null || path.isEmpty()) {
            System.out.println("No route found.");
            return;
        }

        String currentLine = null;
        System.out.println("\nRoute with line details:");

        for (int i = 0; i < path.size(); i++) {
            String station = path.get(i);
            System.out.print(station);

            if (i < path.size() - 1) {
                Set<String> linesFrom = stations.get(station).lines;
                Set<String> linesTo = stations.get(path.get(i + 1)).lines;

                Set<String> intersection = new HashSet<>(linesFrom);
                intersection.retainAll(linesTo); //to retain only the elements in a collection that are also contained in another specified collection

                String newLine = intersection.isEmpty() ? "Unknown" : intersection.iterator().next();

                if (currentLine != null && !currentLine.equals(newLine)) {
                    System.out.print(" >> Change to line: " + newLine + " (+5 min)");
                }

                currentLine = newLine;
            }

            System.out.println();
        }
    }
}

public class MetroRouteOptimizere {
    public static void main(String[] args) {
        MetroMap metro = new MetroMap();

        // Sample network — You can expand this
        metro.addStation("Central Secretariat", "Yellow");
        metro.addStation("Patel Chowk", "Yellow");
        metro.addStation("Rajiv Chowk", "Yellow");
        metro.addStation("Mandi House", "Blue");
        metro.addStation("Supreme Court", "Blue");
        metro.addStation("Indraprastha", "Blue");
        metro.addStation("Yamuna Bank", "Blue");
        metro.addStation("Akshardham", "Blue");
        metro.addStation("Mayur Vihar", "Blue");
        metro.addStation("Hazrat Nizamuddin", "Pink");
        metro.addStation("Ashram", "Pink");
        metro.addStation("Vinobapuri", "Pink");
        metro.addStation("Lajpat Nagar", "Pink");
        metro.addStation("South Extension", "Pink");
        metro.addStation("Dilli Haat INA", "Pink");  
        metro.addStation("Jor Bagh", "Yellow");
        metro.addStation("Lok Kalyan Marg", "Yellow");
        metro.addStation("Udyog Bhawan", "Yellow");
        metro.addStation("Khan Market", "Violet");
        metro.addStation("JLN Stadium", "Violet");
        metro.addStation("Jangpura", "Violet");
        metro.addStation("Janpath", "Violet");

        metro.connectStations("Central Secretariat", "Patel Chowk", 2); // Yellow line
        metro.connectStations("Patel Chowk", "Rajiv Chowk", 2); // Yellow " "
        // blue line
        metro.connectStations("Rajiv Chowk", "Mandi House", 2);  
        metro.connectStations("Mandi House", "Supreme Court", 2); 
        metro.connectStations("Supreme Court", "Indraprastha", 2); 
        metro.connectStations("Indraprastha", "Yamuna Bank", 2);
        metro.connectStations("Yamuna Bank", "Akshardham", 3); 
        metro.connectStations("Akshardham", "Mayur Vihar", 2); 
        // pink Line 
        metro.connectStations("Hazrat Nizamuddin", "Ashram", 2); 
        metro.connectStations("Ashram", "Vinobapuri", 2);
        metro.connectStations("Vinobapuri", "Lajpat Nagar", 2); 
        metro.connectStations("Lajpat Nagar", "South Extension", 2); 
        metro.connectStations("South Extension", "Dilli Haat INA", 2); 
        // yellow line 
        metro.connectStations("Dilli Haat INA", "Jor Bagh", 2); 
        metro.connectStations("Jor Bagh", "Lok Kalyan Marg", 2); 
        metro.connectStations("Lok Kalyan Marg", "Udyog Bhawan", 2); 
        metro.connectStations("Udyog Bhawan", "Central Secretariat", 2); 

        // Violet line
        metro.connectStations("Khan Market", "JLN Stadium", 2); 
        metro.connectStations("JLN Stadium", "Jangpura", 2); 
        metro.connectStations("Jangpura", "Lajpat Nagar", 2); 
        metro.connectStations("Khan Market", "Central Secretariat", 2); 
        metro.connectStations("Janpath", "Rajiv Chowk", 2);


        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter source station: ");
        String source = scanner.nextLine().trim();
        System.out.print("Enter destination station: ");
        String destination = scanner.nextLine().trim();

        List<String> route = metro.findFastestRoute(source, destination);
        if (route == null || route.size() <= 1) {
            System.out.println("No valid route found.");
        } else {
            metro.printRouteWithLineChanges(route);
            System.out.println("Total travel time : " + metro.getTotalTime(route) + " minutes"); //with interchanges
        }
    }
}
