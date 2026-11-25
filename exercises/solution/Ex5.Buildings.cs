namespace Ex5;

public interface IBuilding
{
    int Yield { get; }
    int Points { get; }
    int TradeRatio { get; }
    bool SafeFromBandit { get; }
}

public class Settlement : IBuilding
{
    public int Yield => 1;
    public int Points => 1;
    public int TradeRatio => 4;
    public bool SafeFromBandit => false;
}

public class City : IBuilding
{
    public int Yield => 2;
    public int Points => 2;
    public int TradeRatio => 4;
    public bool SafeFromBandit => false;
}

public abstract class Upgrade(IBuilding inner) : IBuilding
{
    public virtual int Yield => inner.Yield;
    public virtual int Points => inner.Points;
    public virtual int TradeRatio => inner.TradeRatio;
    public virtual bool SafeFromBandit => inner.SafeFromBandit;
}

public class Harbour(IBuilding inner) : Upgrade(inner)
{
    public override int TradeRatio => 3;
}

public class Walls(IBuilding inner) : Upgrade(inner)
{
    public override bool SafeFromBandit => true;
}

public static class Buildings
{
    public static IBuilding Settlement() => new Settlement();
    public static IBuilding City() => new City();
    public static IBuilding WithHarbour(IBuilding building) => new Harbour(building);
    public static IBuilding WithWalls(IBuilding building) => new Walls(building);
}
