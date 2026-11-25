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

public class SettlementWithHarbour : IBuilding
{
    public int Yield => 1;
    public int Points => 1;
    public int TradeRatio => 3;
    public bool SafeFromBandit => false;
}

public class CityWithHarbour : IBuilding
{
    public int Yield => 2;
    public int Points => 2;
    public int TradeRatio => 3;
    public bool SafeFromBandit => false;
}

public static class Buildings
{
    public static IBuilding Settlement() => new Settlement();
    public static IBuilding City() => new City();

    public static IBuilding WithHarbour(IBuilding building) => building switch
    {
        Ex5.Settlement => new SettlementWithHarbour(),
        Ex5.City => new CityWithHarbour(),
        _ => throw new NotSupportedException(),
    };

    public static IBuilding WithWalls(IBuilding building) => throw new NotImplementedException();
}
