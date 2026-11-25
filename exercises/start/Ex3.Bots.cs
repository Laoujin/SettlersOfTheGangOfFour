namespace Ex3;

public record GameView(int Ore, int Grain, int Timber, int Clay);

public enum Difficulty { CitiesFirst, RoadRush }

public class BotPlayer(Difficulty difficulty)
{
    public string NextMove(GameView v)
    {
        switch (difficulty)
        {
            case Difficulty.CitiesFirst:
                return v.Ore >= 3 && v.Grain >= 2 ? "city" : "wait";
            case Difficulty.RoadRush:
                return v.Timber >= 1 && v.Clay >= 1 ? "road" : "wait";
            default:
                throw new ArgumentOutOfRangeException(nameof(difficulty));
        }
    }
}

public static class Bots
{
    public static BotPlayer CitiesFirst() => new(Difficulty.CitiesFirst);
    public static BotPlayer RoadRush() => new(Difficulty.RoadRush);
    public static BotPlayer Trader() => throw new NotImplementedException();
}
