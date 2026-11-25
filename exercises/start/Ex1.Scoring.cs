namespace Ex1;

public class Settlement { }
public class City { }
public class Road { }
public class Tower { }

public static class Scorer
{
    public static int Score(IEnumerable<object> pieces)
    {
        var total = 0;
        foreach (var piece in pieces)
        {
            if (piece is Settlement)
                total += 1;
            else if (piece is City)
                total += 2;
        }
        return total;
    }
}
