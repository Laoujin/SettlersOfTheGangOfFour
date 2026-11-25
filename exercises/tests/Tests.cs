using Xunit;

namespace Settlers.Tests;

public class Ex1Scoring
{
    [Fact]
    public void SettlementAndCity() => Assert.Equal(3, Ex1.Scorer.Score([new Ex1.Settlement(), new Ex1.City()]));

    [Fact]
    public void RoadsScoreNothing() => Assert.Equal(0, Ex1.Scorer.Score([new Ex1.Road(), new Ex1.Road()]));

    [Fact(Skip = Rules.Tower)]
    public void TowerIsWorthThree() => Assert.Equal(4, Ex1.Scorer.Score([new Ex1.Settlement(), new Ex1.Tower()]));
}

public class Ex2Turn
{
    [Fact]
    public void HumanTurn()
    {
        var game = new Ex2.Game();
        new Ex2.HumanTurn().Play(game);
        Assert.Equal(["rolled 8", "human builds", "end"], game.Log);
    }

    [Fact]
    public void BotTurn()
    {
        var game = new Ex2.Game();
        new Ex2.BotTurn().Play(game);
        Assert.Equal(["rolled 8", "bot builds", "end"], game.Log);
    }

    [Fact(Skip = Rules.BanditCheck)]
    public void EveryTurnChecksTheBanditFirst()
    {
        var human = new Ex2.Game { BanditOnYourTile = true };
        var bot = new Ex2.Game { BanditOnYourTile = true };
        new Ex2.HumanTurn().Play(human);
        new Ex2.BotTurn().Play(bot);
        Assert.Equal("bandit!", human.Log[0]);
        Assert.Equal("bandit!", bot.Log[0]);
    }
}

public class Ex3Bots
{
    [Fact]
    public void CitiesFirst() => Assert.Equal("city", Ex3.Bots.CitiesFirst().NextMove(new(Ore: 3, Grain: 2, Timber: 0, Clay: 0)));

    [Fact]
    public void RoadRush() => Assert.Equal("road", Ex3.Bots.RoadRush().NextMove(new(Ore: 0, Grain: 0, Timber: 1, Clay: 1)));

    [Fact]
    public void BotsWait() => Assert.Equal("wait", Ex3.Bots.CitiesFirst().NextMove(new(0, 0, 1, 1)));

    [Fact(Skip = Rules.Trader)]
    public void TraderTradesFourOfAKind() => Assert.Equal("trade", Ex3.Bots.Trader().NextMove(new(Ore: 0, Grain: 4, Timber: 0, Clay: 0)));
}

public class Ex4Dice
{
    [Fact]
    public void RollsProduceOrMoveTheBandit()
    {
        var (board, bandit, chat) = (new Ex4.Board(), new Ex4.Bandit(), new Ex4.Chat());
        var dice = Ex4.Table.Setup(board, bandit, chat, 8, 7);
        dice.Roll();
        dice.Roll();
        Assert.Equal([8], board.Produced);
        Assert.Equal(1, bandit.Moves);
    }

    [Fact(Skip = Rules.Chat)]
    public void EveryRollIsLoggedToTheChat()
    {
        var chat = new Ex4.Chat();
        var dice = Ex4.Table.Setup(new Ex4.Board(), new Ex4.Bandit(), chat, 8, 7);
        dice.Roll();
        dice.Roll();
        Assert.Equal(["rolled 8", "rolled 7"], chat.Lines);
    }
}

public class Ex5Buildings
{
    [Fact]
    public void City() => Assert.Equal((2, 2, 4), (Ex5.Buildings.City().Yield, Ex5.Buildings.City().Points, Ex5.Buildings.City().TradeRatio));

    [Fact]
    public void HarbourSettlementTradesThreeForOne()
    {
        var b = Ex5.Buildings.WithHarbour(Ex5.Buildings.Settlement());
        Assert.Equal((1, 1, 3), (b.Yield, b.Points, b.TradeRatio));
    }

    [Fact(Skip = Rules.Walls)]
    public void WallsOnAnything()
    {
        var city = Ex5.Buildings.WithWalls(Ex5.Buildings.City());
        var port = Ex5.Buildings.WithWalls(Ex5.Buildings.WithHarbour(Ex5.Buildings.Settlement()));
        Assert.True(city.SafeFromBandit);
        Assert.Equal(2, city.Points);
        Assert.True(port.SafeFromBandit);
        Assert.Equal(3, port.TradeRatio);
        Assert.False(Ex5.Buildings.City().SafeFromBandit);
    }
}

public class Ex6UndoAndSave
{
    [Fact]
    public void Moves()
    {
        var game = new Ex6.Game();
        game.Click("road", "A");
        game.Click("harvest", "");
        Assert.Equal(["A"], game.Roads);
        Assert.Equal(2, game.Grain);
    }

    [Fact(Skip = Rules.Undo)]
    public void UndoTheLastMoves()
    {
        var game = new Ex6.Game();
        game.Click("road", "A");
        game.Click("harvest", "");
        game.Undo();
        Assert.Equal(0, game.Grain);
        game.Undo();
        Assert.Empty(game.Roads);
    }

    [Fact(Skip = Rules.Save)]
    public void SaveAndRestore()
    {
        var game = new Ex6.Game();
        game.Click("road", "A");
        var save = game.Save();
        game.Click("road", "B");
        game.Click("harvest", "");
        game.Restore(save);
        Assert.Equal(["A"], game.Roads);
        Assert.Equal(0, game.Grain);
    }
}
