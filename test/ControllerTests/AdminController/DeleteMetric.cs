using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using StatusMonitor.Web.Controllers.View;
using StatusMonitor.Shared.Extensions;
using StatusMonitor.Shared.Models.Entities;
using StatusMonitor.Shared.Services;
using Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using StatusMonitor.Shared.Models;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using StatusMonitor.Web.Services;
using System.Linq;
using StatusMonitor.Web.ViewModels;

namespace StatusMonitor.Tests.ControllerTests
{
	public partial class AdminControllerTest
	{
		[Fact]
		public async Task DeleteMetricFailure()
		{
			// Arrange
			_mockApiController
				.Setup(api => api.RemoveMetric(It.IsAny<MetricRemovalViewModel>()))
				.ReturnsAsync(new BadRequestResult());

			// Act
			var result = await _controller.DeleteMetric(new MetricRemovalViewModel());

			// Assert
			Assert.IsType<BadRequestResult>(result);
		}

		[Fact]
		public async Task DeleteMetricSuccess()
		{
			// Arrange
			_mockApiController
				.Setup(api => api.RemoveMetric(It.IsAny<MetricRemovalViewModel>()))
				.ReturnsAsync(new OkObjectResult("Good"));

			// Act
			var result = await _controller.DeleteMetric(new MetricRemovalViewModel());

			// Assert
			var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);

			Assert.Equal("Index", redirectToActionResult.ActionName);
			Assert.Equal("Home", redirectToActionResult.ControllerName);
		}
	}
}
