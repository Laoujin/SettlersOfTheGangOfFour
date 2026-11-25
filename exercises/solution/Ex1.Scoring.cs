namespace Ex1;

public interface IPiece
{
    int Points { get; }
}

public class Settlement : IPiece { public int Points => 1; }
public class City : IPiece { public int Points => 2; }
public class Road : IPiece { public int Points => 0; }
public class Tower : IPiece { public int Points => 3; }

public static class Scorer
{
    public static int Score(IEnumerable<IPiece> pieces) => pieces.Sum(p => p.Points);
}
